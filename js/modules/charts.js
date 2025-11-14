/**
 * Charts Module
 * Handles all chart visualizations using Chart.js
 */

const Charts = {
    charts: {},

    init() {
        // Wait for Chart.js to load
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        this.createAccuracyChart();
        this.createROCChart();
        this.createFeatureChart();
        this.createRiskChart();
        this.createDiseaseStatsChart();
    },

    createAccuracyChart() {
        const ctx = document.getElementById('accuracyChart');
        if (!ctx) return;

        this.charts.accuracy = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Logistic Regression', 'Random Forest', 'XGBoost', 'SVM', 'MLP', 'Voting (MLP+RF)'],
                datasets: [{
                    label: 'Accuracy (%)',
                    data: [86.0, 96.7, 96.9, 91.1, 96.9, 97.9],
                    backgroundColor: [
                        'rgba(31, 191, 113, 0.8)',
                        'rgba(31, 191, 113, 0.8)',
                        'rgba(31, 191, 113, 0.8)',
                        'rgba(31, 191, 113, 0.8)',
                        'rgba(31, 191, 113, 0.8)',
                        'rgba(139, 195, 74, 0.9)'
                    ],
                    borderColor: [
                        '#1FBF71',
                        '#1FBF71',
                        '#1FBF71',
                        '#1FBF71',
                        '#1FBF71',
                        '#8BC34A'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Accuracy: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    },

    createROCChart() {
        const ctx = document.getElementById('rocChart');
        if (!ctx) return;

        this.charts.roc = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Logistic Regression', 'Random Forest', 'XGBoost', 'SVM', 'MLP', 'Voting (MLP+RF)'],
                datasets: [{
                    label: 'ROC-AUC Score',
                    data: [93.0, 99.4, 99.4, 96.3, 98.9, 99.5],
                    borderColor: '#1FBF71',
                    backgroundColor: 'rgba(31, 191, 113, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#1FBF71',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'ROC-AUC: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 90,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    },

    createFeatureChart() {
        const ctx = document.getElementById('featureChart');
        if (!ctx) return;

        this.charts.feature = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Alcohol', 'LFT', 'BMI', 'Age', 'Genetic Risk', 'Smoking', 'Diabetes', 'Physical Activity', 'Hypertension', 'Gender'],
                datasets: [{
                    label: 'Importance',
                    data: [22.4, 21.8, 9.5, 9.7, 7.2, 6.4, 3.0, 8.6, 4.8, 6.5],
                    backgroundColor: 'rgba(31, 191, 113, 0.75)',
                    borderColor: '#1FBF71',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Importance: ' + context.parsed.x + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 25,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    createRiskChart() {
        const ctx = document.getElementById('riskChart');
        if (!ctx) return;

        this.charts.risk = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: [
                        '#1FBF71',
                        '#8BC34A',
                        '#C5E1A5'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    },

    createDiseaseStatsChart() {
        const ctx = document.getElementById('diseaseStatsChart');
        if (!ctx) return;

        this.charts.diseaseStats = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Alcohol-related', 'NAFLD', 'Viral Hepatitis', 'Other'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: [
                        'rgba(31, 191, 113, 0.85)',
                        'rgba(139, 195, 74, 0.85)',
                        'rgba(200, 230, 201, 0.9)',
                        'rgba(232, 245, 233, 0.95)'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Charts.init());
} else {
    Charts.init();
}

