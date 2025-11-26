/**
 * Detection Module
 * Handles liver disease detection form, validation, and results display
 */

// Make Detection available globally for dashboard
window.Detection = {
    // Store current detection data for PDF generation
    currentDetectionData: null,
    currentProbability: null,
    currentRiskLevel: null,
    currentRecommendations: null,

    async fetchPrediction(data) {
        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Prediction request failed');
            }

            return {
                probability: parseFloat(result.probability),
                riskLevel: result.riskLevel || this.getRiskLevel(parseFloat(result.probability)).level,
                source: 'model'
            };
        } catch (error) {
            console.error('Prediction API error:', error);
            const fallbackProbability = this.predictFallback(data);
            const fallbackRisk = this.getRiskLevel(fallbackProbability).level;
            return {
                probability: fallbackProbability,
                riskLevel: fallbackRisk,
                source: 'fallback'
            };
        }
    },

    // Heuristic fallback
    predictFallback(data) {
        let riskScore = 0;
        
        // Age factor (higher risk for older age)
        if (data.age >= 60) riskScore += 15;
        else if (data.age >= 50) riskScore += 10;
        else if (data.age >= 40) riskScore += 5;
        
        // Gender (males slightly higher risk)
        if (data.gender == 1) riskScore += 3;
        
        // BMI factor
        if (data.bmi >= 30) riskScore += 20;
        else if (data.bmi >= 25) riskScore += 10;
        else if (data.bmi < 18.5) riskScore += 5;
        
        // Alcohol consumption
        if (data.alcohol >= 20) riskScore += 25;
        else if (data.alcohol >= 10) riskScore += 15;
        else if (data.alcohol >= 5) riskScore += 8;
        
        // Smoking
        if (data.smoking == 1) riskScore += 12;
        
        // Genetic risk
        if (data.geneticRisk == 1) riskScore += 15;
        
        // Physical activity (lower activity = higher risk)
        if (data.physicalActivity < 2) riskScore += 10;
        else if (data.physicalActivity < 5) riskScore += 5;
        else riskScore -= 5; // Regular exercise reduces risk
        
        // Diabetes
        if (data.diabetes == 1) riskScore += 12;
        
        // Hypertension
        if (data.hypertension == 1) riskScore += 10;
        
        // Liver function test (higher values indicate problems)
        if (data.liverFunctionTest >= 80) riskScore += 20;
        else if (data.liverFunctionTest >= 60) riskScore += 12;
        else if (data.liverFunctionTest >= 40) riskScore += 5;
        
        // Normalize to 0-100 probability
        const baseProbability = Math.min(riskScore, 95);
        const randomFactor = (Math.random() - 0.5) * 5; // ±2.5% variation
        let probability = baseProbability + randomFactor;
        
        // Ensure probability is between 5% and 95%
        probability = Math.max(5, Math.min(95, probability));
        
        return Math.round(probability * 10) / 10;
    },

    getRiskLevel(probability) {
        if (probability < 30) return { level: 'low', label: 'Low Risk', color: 'low' };
        if (probability < 60) return { level: 'medium', label: 'Medium Risk', color: 'medium' };
        return { level: 'high', label: 'High Risk', color: 'high' };
    },

    getRecommendations(probability, data) {
        const recommendations = [];
        
        if (probability >= 60) {
            recommendations.push('Consult with a healthcare professional immediately for further evaluation.');
            recommendations.push('Consider scheduling comprehensive liver function tests.');
        } else if (probability >= 30) {
            recommendations.push('Schedule a consultation with your healthcare provider.');
            recommendations.push('Monitor your liver health regularly.');
        } else {
            recommendations.push('Continue maintaining a healthy lifestyle.');
        }
        
        if (data.alcohol >= 10) {
            recommendations.push('Consider reducing alcohol consumption to lower your risk.');
        }
        
        if (data.bmi >= 25) {
            recommendations.push('Maintaining a healthy weight can help reduce liver disease risk.');
        }
        
        if (data.physicalActivity < 5) {
            recommendations.push('Increase physical activity to at least 150 minutes per week.');
        }
        
        if (data.smoking == 1) {
            recommendations.push('Quitting smoking can significantly improve liver health.');
        }
        
        if (data.diabetes == 1 || data.hypertension == 1) {
            recommendations.push('Manage your existing conditions with proper medical care.');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Continue regular health checkups and maintain a balanced lifestyle.');
        }
        
        return recommendations;
    },

    updateProbabilityCircle(probability) {
        const circle = document.getElementById('probabilityArc');
        if (!circle) return;

        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference - (probability / 100) * circumference;
        
        // Determine color based on risk level using new color scheme
        let color = '#1FBF71'; // default green
        if (probability >= 60) {
            color = '#0B6623'; // deep green for high
        } else if (probability >= 30) {
            color = '#8BC34A'; // lighter green for medium
        }
        
        // Animate the circle
        circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out, stroke 0.5s ease';
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = color;
        
        // Animate the number
        const probValue = document.getElementById('probabilityValue');
        if (probValue && window.AnimationUtils) {
            window.AnimationUtils.animateNumber(
                probValue,
                0,
                probability,
                1500,
                (val) => val.toFixed(1) + '%'
            );
        } else if (probValue) {
            probValue.textContent = probability.toFixed(1) + '%';
        }
    },

    displayResults(probability, data) {
        const resultsSection = document.getElementById('resultsSection');
        if (!resultsSection) return;

        const riskInfo = this.getRiskLevel(probability);
        
        // Store data for PDF generation
        this.currentDetectionData = data;
        this.currentProbability = probability;
        this.currentRiskLevel = riskInfo;
        this.currentRecommendations = this.getRecommendations(probability, data);
        
        // Update probability value with animation
        const probValue = document.getElementById('probabilityValue');
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
        
        // Update risk badge with animation
        const riskBadge = document.getElementById('riskBadge');
        if (riskBadge) {
            riskBadge.textContent = riskInfo.label;
            riskBadge.className = 'risk-badge ' + riskInfo.color;
            riskBadge.style.animation = 'scaleIn 0.5s ease';
        }
        
        // Update result message
        let message = `Based on the provided information, your risk of liver disease is ${probability.toFixed(1)}%. `;
        if (riskInfo.level === 'low') {
            message += 'This indicates a relatively low risk. However, it\'s important to maintain a healthy lifestyle and regular checkups.';
        } else if (riskInfo.level === 'medium') {
            message += 'This indicates a moderate risk. We recommend consulting with a healthcare professional for further evaluation.';
        } else {
            message += 'This indicates a higher risk. We strongly recommend consulting with a healthcare professional as soon as possible.';
        }
        
        const resultMessage = document.getElementById('resultMessage');
        if (resultMessage) {
            resultMessage.textContent = message;
            if (window.AnimationUtils) {
                window.AnimationUtils.fadeIn(resultMessage, 500);
            }
        }
        
        // Update recommendations with stagger animation
        const recommendations = this.getRecommendations(probability, data);
        const recommendationsList = document.getElementById('recommendationsList');
        if (recommendationsList) {
            recommendationsList.innerHTML = '';
            recommendations.forEach((rec, index) => {
                const li = document.createElement('li');
                li.textContent = rec;
                li.classList.add('stagger-item');
                li.style.animationDelay = `${index * 0.1}s`;
                recommendationsList.appendChild(li);
            });
        }
        
        // Show results section with fade in
        if (window.AnimationUtils) {
            resultsSection.style.display = 'block';
            window.AnimationUtils.fadeIn(resultsSection, 500);
        } else {
            resultsSection.style.display = 'block';
        }
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Animate probability circle
        setTimeout(() => {
            this.updateProbabilityCircle(probability);
        }, 300);
    },

    showLoadingState(submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    },

    hideLoadingState(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    },

    resetForm() {
        const form = document.getElementById('detectionForm');
        const resultsSection = document.getElementById('resultsSection');
        
        if (form) form.reset();
        
        if (resultsSection) {
            if (window.AnimationUtils) {
                window.AnimationUtils.fadeOut(resultsSection, 300);
                setTimeout(() => {
                    resultsSection.style.display = 'none';
                }, 300);
            } else {
                resultsSection.style.display = 'none';
            }
        }
        
        // Reset probability circle
        const circle = document.getElementById('probabilityArc');
        if (circle) {
            circle.style.strokeDashoffset = '339.292';
            circle.style.stroke = '#32CD32'; // accent green
        }
        
        // Scroll to top of form
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    validateForm(data) {
        return !Object.values(data).some(val => isNaN(val) || val === null || val === undefined);
    },

    init() {
        const form = document.getElementById('detectionForm');
        if (!form) return;

        const submitBtn = document.getElementById('submitBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
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
            
            // Validate data
            if (!this.validateForm(data)) {
                alert('Please fill in all fields correctly.');
                return;
            }
            
            // Show loading state with heartbeat animation
            if (submitBtn) {
                this.showLoadingState(submitBtn);
                if (window.AnimationUtils) {
                    window.AnimationUtils.heartbeat(submitBtn, 1500);
                }
            }

            try {
                const prediction = await this.fetchPrediction(data);
                const probability = parseFloat(prediction.probability);
                
                if (Number.isNaN(probability)) {
                    throw new Error('Invalid prediction result');
                }

                this.displayResults(probability, data);
            } catch (error) {
                console.error('Prediction error:', error);
                alert('We were unable to calculate your risk right now. Please try again.');
            } finally {
                if (submitBtn) {
                    this.hideLoadingState(submitBtn);
                }
            }
        });
        
        // Make resetForm available globally
        window.resetForm = () => this.resetForm();
    },

    downloadPDF() {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }

        // Check if there's detection data available
        if (!this.currentDetectionData || this.currentProbability === null) {
            alert('No detection results available. Please run an analysis first.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const data = this.currentDetectionData;
        const probability = this.currentProbability;
        const riskInfo = this.currentRiskLevel;
        const recommendations = this.currentRecommendations || [];
        
        // Get current date and time
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        let yPos = 20;
        const lineHeight = 7;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (margin * 2);

        // Header
        doc.setFontSize(20);
        doc.setTextColor(31, 191, 113); // Green color
        doc.text('LiverCare AI', margin, yPos);
        
        yPos += 8;
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Liver Disease Risk Assessment Report', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${dateStr} at ${timeStr}`, margin, yPos);
        
        yPos += 15;

        // Patient Information Section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Patient Information', margin, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        const patientInfo = [
            ['Age:', data.age + ' years'],
            ['Gender:', data.gender == 1 ? 'Male' : 'Female'],
            ['BMI (Body Mass Index):', data.bmi.toFixed(1)],
            ['Alcohol Consumption:', data.alcohol.toFixed(1) + ' units/week'],
            ['Smoking Status:', data.smoking == 1 ? 'Yes' : 'No'],
            ['Genetic Risk (Family History):', data.geneticRisk == 1 ? 'Yes' : 'No'],
            ['Physical Activity:', data.physicalActivity.toFixed(1) + ' hours/week'],
            ['Diabetes:', data.diabetes == 1 ? 'Yes' : 'No'],
            ['Hypertension:', data.hypertension == 1 ? 'Yes' : 'No'],
            ['Liver Function Test:', data.liverFunctionTest.toFixed(1) + ' IU/L']
        ];

        patientInfo.forEach(([label, value]) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(label, margin, yPos);
            doc.text(value, margin + 70, yPos);
            yPos += lineHeight;
        });

        yPos += 10;

        // Risk Assessment Section
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Risk Assessment', margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        // Probability
        doc.text('Risk Probability:', margin, yPos);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(31, 191, 113);
        doc.text(probability.toFixed(1) + '%', margin + 70, yPos);
        yPos += lineHeight;

        // Risk Level
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('Risk Level:', margin, yPos);
        doc.setFont(undefined, 'bold');
        
        // Color based on risk level
        if (riskInfo.level === 'high') {
            doc.setTextColor(220, 53, 69); // Red
        } else if (riskInfo.level === 'medium') {
            doc.setTextColor(255, 193, 7); // Orange/Yellow
        } else {
            doc.setTextColor(31, 191, 113); // Green
        }
        
        doc.text(riskInfo.label, margin + 70, yPos);
        yPos += 10;

        // Result Message
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        let message = `Based on the provided information, your risk of liver disease is ${probability.toFixed(1)}%. `;
        if (riskInfo.level === 'low') {
            message += 'This indicates a relatively low risk. However, it\'s important to maintain a healthy lifestyle and regular checkups.';
        } else if (riskInfo.level === 'medium') {
            message += 'This indicates a moderate risk. We recommend consulting with a healthcare professional for further evaluation.';
        } else {
            message += 'This indicates a higher risk. We strongly recommend consulting with a healthcare professional as soon as possible.';
        }

        const splitMessage = doc.splitTextToSize(message, contentWidth);
        splitMessage.forEach(line => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += lineHeight;
        });

        yPos += 10;

        // Recommendations Section
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Recommendations', margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        recommendations.forEach((rec, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${rec}`, margin + 5, yPos);
            yPos += lineHeight + 2;
        });

        yPos += 10;

        // Disclaimer
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'italic');
        
        const disclaimer = 'This report is generated for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for diagnosis and treatment decisions.';
        const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
        splitDisclaimer.forEach(line => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += lineHeight;
        });

        // Footer
        const totalPages = doc.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Page ${i} of ${totalPages} | LiverCare AI - Powered by XtarzLab`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Generate filename with date
        const filename = `LiverCare_Report_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.pdf`;
        
        // Save the PDF
        doc.save(filename);
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Detection.init());
} else {
    Detection.init();
}

