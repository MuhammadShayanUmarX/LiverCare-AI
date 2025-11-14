// Detection form handling and prediction logic

// Simple rule-based prediction algorithm
// This can be replaced with API call or TensorFlow.js model
function predictLiverDisease(data) {
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
    // Add some randomness to simulate ML model behavior
    const baseProbability = Math.min(riskScore, 95);
    const randomFactor = (Math.random() - 0.5) * 5; // ±2.5% variation
    let probability = baseProbability + randomFactor;
    
    // Ensure probability is between 5% and 95%
    probability = Math.max(5, Math.min(95, probability));
    
    return Math.round(probability * 10) / 10; // Round to 1 decimal
}

function getRiskLevel(probability) {
    if (probability < 30) return { level: 'low', label: 'Low Risk', color: 'low' };
    if (probability < 60) return { level: 'medium', label: 'Medium Risk', color: 'medium' };
    return { level: 'high', label: 'High Risk', color: 'high' };
}

function getRecommendations(probability, data) {
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
}

function updateProbabilityCircle(probability) {
    const circle = document.getElementById('probabilityArc');
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (probability / 100) * circumference;
    
    // Determine color based on risk level
    let color = '#1FBF71'; // default green
    if (probability >= 60) {
        color = '#0B6623'; // deep green for high
    } else if (probability >= 30) {
        color = '#8BC34A'; // lighter green for medium
    }
    
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = color;
    
    // Animate the circle
    circle.style.transition = 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease';
}

function displayResults(probability, data) {
    const resultsSection = document.getElementById('resultsSection');
    const riskInfo = getRiskLevel(probability);
    
    // Update probability value
    document.getElementById('probabilityValue').textContent = probability.toFixed(1);
    
    // Update risk badge
    const riskBadge = document.getElementById('riskBadge');
    riskBadge.textContent = riskInfo.label;
    riskBadge.className = 'risk-badge ' + riskInfo.color;
    
    // Update result message
    let message = `Based on the provided information, your risk of liver disease is ${probability.toFixed(1)}%. `;
    if (riskInfo.level === 'low') {
        message += 'This indicates a relatively low risk. However, it\'s important to maintain a healthy lifestyle and regular checkups.';
    } else if (riskInfo.level === 'medium') {
        message += 'This indicates a moderate risk. We recommend consulting with a healthcare professional for further evaluation.';
    } else {
        message += 'This indicates a higher risk. We strongly recommend consulting with a healthcare professional as soon as possible.';
    }
    document.getElementById('resultMessage').textContent = message;
    
    // Update recommendations
    const recommendations = getRecommendations(probability, data);
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Animate probability circle
    setTimeout(() => {
        updateProbabilityCircle(probability);
    }, 200);
}

function resetForm() {
    const form = document.getElementById('detectionForm');
    const resultsSection = document.getElementById('resultsSection');
    
    form.reset();
    resultsSection.style.display = 'none';
    
    // Reset probability circle
    const circle = document.getElementById('probabilityArc');
    circle.style.strokeDashoffset = '339.292';
    circle.style.stroke = '#4CAF50';
    
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('detectionForm');
    const submitBtn = document.getElementById('submitBtn');
    if (form) {
        form.addEventListener('submit', function(e) {
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
            if (Object.values(data).some(val => isNaN(val) || val === null || val === undefined)) {
                alert('Please fill in all fields correctly.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulate API call delay (can be replaced with actual API call)
            setTimeout(() => {
                // Make prediction
                const probability = predictLiverDisease(data);
                
                // Display results
                displayResults(probability, data);
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 1500);
        });
    }
    
    // Make resetForm available globally
    window.resetForm = resetForm;
});

