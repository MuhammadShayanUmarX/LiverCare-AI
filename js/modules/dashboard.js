/**
 * Dashboard Module
 * Integrates detection and chatbot in a unified dashboard
 */

const Dashboard = {
    currentUser: null,

    init() {
        // Check if user is logged in
        this.checkAuth();
        
        // Initialize components
        this.initPanels();
        this.initDetection();
        this.initChatbot();
        this.initLogout();
        this.loadUserStats();
        this.loadHistory();
    },

    checkAuth() {
        const userStr = sessionStorage.getItem('currentUser');
        if (!userStr) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = JSON.parse(userStr);
        this.updateWelcomeMessage();
    },

    updateWelcomeMessage() {
        const welcomeMsg = document.getElementById('welcomeMessage');
        const userInitials = document.getElementById('userInitials');
        
        if (welcomeMsg && this.currentUser) {
            const firstName = this.currentUser.firstName || 'User';
            welcomeMsg.textContent = `Welcome back, ${firstName}!`;
        }
        
        if (userInitials && this.currentUser) {
            const first = (this.currentUser.firstName || 'U')[0].toUpperCase();
            const last = (this.currentUser.lastName || '')[0].toUpperCase();
            userInitials.textContent = first + (last || '');
        }
    },

    initPanels() {
        // Initialize tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // Remove active class from all tabs and panels
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                btn.classList.add('active');
                const targetPanel = document.getElementById(targetTab + 'Tab');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    
                    // Load content when switching tabs
                    if (targetTab === 'history') {
                        this.loadHistory();
                    }
                }
            });
        });
    },

    initDetection() {
        const form = document.getElementById('dashboardDetectionForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDetection(form);
        });
    },

    async handleDetection(form) {
        const formData = new FormData(form);
        const data = {
            age: parseFloat(formData.get('age')),
            gender: parseInt(formData.get('gender')),
            bmi: parseFloat(formData.get('bmi')),
            alcohol: parseFloat(formData.get('alcohol')),
            smoking: parseInt(formData.get('smoking')),
            geneticRisk: parseInt(formData.get('geneticRisk')),
            physicalActivity: parseFloat(formData.get('physicalActivity')),
            diabetes: parseInt(formData.get('diabetes')),
            hypertension: parseInt(formData.get('hypertension')),
            liverFunctionTest: parseFloat(formData.get('liverFunctionTest'))
        };

        // Validate
        if (Object.values(data).some(val => isNaN(val) || val === null || val === undefined)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const submitBtn = document.getElementById('dashboardSubmitBtn');

        // Show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        }

        try {
            const prediction = await window.Detection.fetchPrediction(data);
            const probability = parseFloat(prediction.probability);

            if (Number.isNaN(probability)) {
                throw new Error('Invalid prediction result');
            }

            const riskInfo = window.Detection.getRiskLevel(probability);
            const recommendations = window.Detection.getRecommendations(probability, data);

            // Save to history (if logged in)
            this.saveDetectionHistory(data, probability, riskInfo.level);

            // Display results
            this.displayDetectionResults(probability, riskInfo, recommendations);
        } catch (error) {
            console.error('Dashboard prediction error:', error);
            alert('We were unable to fetch a prediction. Please try again later.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }
    },

    displayDetectionResults(probability, riskInfo, recommendations) {
        const resultsDiv = document.getElementById('dashboardResults');
        const probValue = document.getElementById('dashboardProbabilityValue');
        const riskBadge = document.getElementById('dashboardRiskBadge');
        const resultMessage = document.getElementById('dashboardResultMessage');
        const recommendationsDiv = document.getElementById('dashboardRecommendations');

        // Update probability
        if (probValue && window.AnimationUtils) {
            window.AnimationUtils.animateNumber(
                probValue,
                0,
                probability,
                1500,
                (val) => val.toFixed(1)
            );
        } else if (probValue) {
            probValue.textContent = probability.toFixed(1);
        }

        // Update risk badge
        if (riskBadge) {
            riskBadge.textContent = riskInfo.label;
            riskBadge.className = 'risk-badge-large ' + riskInfo.color;
        }

        // Update message
        if (resultMessage) {
            let message = `Your risk of liver disease is ${probability.toFixed(1)}%. `;
            if (riskInfo.level === 'low') {
                message += 'This indicates a relatively low risk. However, it\'s important to maintain a healthy lifestyle and regular checkups.';
            } else if (riskInfo.level === 'medium') {
                message += 'This indicates a moderate risk. We recommend consulting with a healthcare professional for further evaluation.';
            } else {
                message += 'This indicates a higher risk. We strongly recommend consulting with a healthcare professional as soon as possible.';
            }
            resultMessage.textContent = message;
        }

        // Update recommendations
        if (recommendationsDiv) {
            recommendationsDiv.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
        }

        // Update probability circle
        this.updateProbabilityCircle(probability);

        // Show results
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            if (window.AnimationUtils) {
                window.AnimationUtils.fadeIn(resultsDiv, 500);
            }
            
            // Scroll to results
            setTimeout(() => {
                resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    },

    updateProbabilityCircle(probability) {
        const circle = document.getElementById('dashboardProbabilityArc');
        if (!circle) return;

        const circumference = 2 * Math.PI * 64; // radius = 64 for large circle
        const offset = circumference - (probability / 100) * circumference;
        
        let color = '#1FBF71';
        if (probability >= 60) {
            color = '#0B6623';
        } else if (probability >= 30) {
            color = '#8BC34A';
        }
        
        circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out, stroke 0.5s ease';
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = color;
    },

    saveDetectionHistory(data, probability, riskLevel) {
        if (!this.currentUser) {
            console.warn('No user logged in, cannot save detection history');
            return;
        }

        // Map form data to API format
        const historyData = {
            userId: this.currentUser.id,
            age: parseFloat(data.age),
            gender: parseInt(data.gender),
            bmi: parseFloat(data.bmi),
            alcohol: parseFloat(data.alcohol),
            smoking: parseInt(data.smoking),
            geneticRisk: parseInt(data.geneticRisk || data.genetic_risk),
            physicalActivity: parseFloat(data.physicalActivity || data.physical_activity),
            diabetes: parseInt(data.diabetes),
            hypertension: parseInt(data.hypertension),
            liverFunctionTest: parseFloat(data.liverFunctionTest || data.liver_function_test),
            probability: parseFloat(probability),
            riskLevel: riskLevel
        };

        // Save to API
        fetch('/api/detection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(historyData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('Detection history saved successfully:', result);
                // Reload stats and history after saving
                this.loadUserStats();
                // If history tab is active, reload it
                const historyTab = document.getElementById('historyTab');
                if (historyTab && historyTab.classList.contains('active')) {
                    this.loadHistory();
                }
            } else {
                throw new Error(result.error || 'Failed to save detection history');
            }
        })
        .catch(error => {
            console.error('Error saving detection history:', error);
            // Fallback to localStorage for offline support
            const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
            history.unshift({
                ...historyData,
                id: Date.now(),
                created_at: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('detectionHistory', JSON.stringify(history.slice(0, 50)));
        });
    },

    loadUserStats() {
        if (!this.currentUser) {
            console.warn('No user logged in, cannot load user stats');
            return;
        }

        // Load from API
        fetch(`/api/detection/history/${this.currentUser.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load stats');
                }
                return response.json();
            })
            .then(history => {
                // Normalize the data format
                const normalizedHistory = history.map(item => ({
                    probability: item.probability,
                    created_at: item.created_at,
                    createdAt: item.created_at || item.createdAt
                }));
                this.updateStats(normalizedHistory);
            })
            .catch(error => {
                console.error('Error loading user stats:', error);
                // Fallback to localStorage
                const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
                    .filter(h => h.userId === this.currentUser.id)
                    .map(item => ({
                        probability: item.probability,
                        created_at: item.created_at || item.createdAt,
                        createdAt: item.created_at || item.createdAt
                    }));
                this.updateStats(history);
            });
    },

    updateStats(history) {
        const totalDetections = document.getElementById('totalDetections');
        const avgRisk = document.getElementById('avgRisk');
        const lastDetection = document.getElementById('lastDetection');

        if (totalDetections) {
            totalDetections.textContent = history.length;
        }

        if (history.length > 0) {
            const avg = history.reduce((sum, h) => sum + (h.probability || 0), 0) / history.length;
            if (avgRisk) {
                avgRisk.textContent = avg.toFixed(1) + '%';
            }

            const last = history[0];
            if (lastDetection && last.createdAt) {
                const date = new Date(last.createdAt);
                lastDetection.textContent = date.toLocaleDateString();
            }
        } else {
            if (avgRisk) avgRisk.textContent = '-';
            if (lastDetection) lastDetection.textContent = '-';
        }
    },

    loadHistory() {
        if (!this.currentUser) {
            console.warn('No user logged in, cannot load detection history');
            return;
        }

        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        // Show loading state
        historyList.innerHTML = '<div class="loading-history">Loading history...</div>';

        fetch(`/api/detection/history/${this.currentUser.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load history');
                }
                return response.json();
            })
            .then(history => {
                // Normalize the data format
                const normalizedHistory = history.map(item => ({
                    id: item.id,
                    age: item.age,
                    bmi: item.bmi,
                    liver_function_test: item.liver_function_test,
                    liverFunctionTest: item.liver_function_test,
                    probability: item.probability,
                    risk_level: item.risk_level,
                    created_at: item.created_at,
                    createdAt: item.created_at || item.createdAt
                }));
                this.displayHistory(normalizedHistory);
            })
            .catch(error => {
                console.error('Error loading detection history:', error);
                // Fallback to localStorage
                const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
                    .filter(h => h.userId === this.currentUser.id)
                    .slice(0, 50)
                    .map(item => ({
                        ...item,
                        created_at: item.created_at || item.createdAt,
                        createdAt: item.created_at || item.createdAt
                    }));
                this.displayHistory(history);
            });
    },

    displayHistory(history) {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        if (!history || history.length === 0) {
            historyList.innerHTML = `
                <div class="no-history-professional">
                    <div class="no-history-icon">📊</div>
                    <h3>No detection history yet</h3>
                    <p>Run your first analysis in the Detection tab to get started!</p>
                    <button class="btn btn-primary" onclick="document.querySelector('[data-tab=detection]').click()">Go to Detection</button>
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.map((item, index) => {
            // Handle date parsing - try multiple formats
            let date;
            try {
                date = new Date(item.created_at || item.createdAt || item.timestamp);
                if (isNaN(date.getTime())) {
                    date = new Date();
                }
            } catch (e) {
                date = new Date();
            }

            const riskLevel = item.risk_level || item.riskLevel || 'low';
            const riskColor = riskLevel === 'high' ? 'high' : 
                            riskLevel === 'medium' ? 'medium' : 'low';
            const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
            
            return `
                <div class="history-item-professional">
                    <div class="history-item-header">
                        <div class="history-item-number">#${history.length - index}</div>
                        <div class="history-item-date">
                            <span class="date-day">${date.getDate()}</span>
                            <span class="date-month">${date.toLocaleDateString('en-US', { month: 'short' })}</span>
                            <span class="date-year">${date.getFullYear()}</span>
                        </div>
                    </div>
                    <div class="history-item-body">
                        <div class="history-risk-display">
                            <div class="risk-badge-professional ${riskColor}">
                                <span class="risk-label">${riskLabel}</span>
                                <span class="risk-percentage">${(item.probability || 0).toFixed(1)}%</span>
                            </div>
                        </div>
                        <div class="history-metrics">
                            <div class="metric-item">
                                <span class="metric-label">Age</span>
                                <span class="metric-value">${item.age || '-'}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">BMI</span>
                                <span class="metric-value">${item.bmi ? item.bmi.toFixed(1) : '-'}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">LFT</span>
                                <span class="metric-value">${item.liver_function_test || item.liverFunctionTest || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    initChatbot() {
        const chatInput = document.getElementById('dashboardChatInput');
        const sendBtn = document.getElementById('dashboardSendBtn');
        const quickButtons = document.querySelectorAll('.quick-btn-small');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendChatMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }

        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                if (question && chatInput) {
                    chatInput.value = question;
                    this.sendChatMessage();
                }
            });
        });
    },

    sendChatMessage() {
        const input = document.getElementById('dashboardChatInput');
        if (!input) return;

        const message = input.value.trim();
        if (message === '') return;

        const messagesContainer = document.getElementById('dashboardChatMessages');
        if (!messagesContainer) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        messagesContainer.appendChild(userMsg);

        input.value = '';

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Get bot response using Chatbot module
        setTimeout(() => {
            const response = window.Chatbot.findResponse(message);
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot-message';
            botMsg.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>${response}</p>
                </div>
            `;
            messagesContainer.appendChild(botMsg);

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    },

    initLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            });
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Dashboard.init());
} else {
    Dashboard.init();
}

