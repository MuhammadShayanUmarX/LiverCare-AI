/**
 * Chatbot Module
 * Handles chatbot interactions with rule-based responses
 */

// Make Chatbot available globally for dashboard
window.Chatbot = {
    responses: {
        greetings: [
            "Hello! How can I help you today?",
            "Hi there! I'm here to answer your questions about liver health.",
            "Welcome! Feel free to ask me anything about liver disease."
        ],
        symptoms: [
            "Common symptoms of liver disease include: fatigue, jaundice (yellowing of skin and eyes), abdominal pain, swelling in legs and ankles, dark urine, pale stool, nausea, loss of appetite, and easy bruising. However, many liver diseases show no symptoms in early stages, which is why regular screening is important.",
            "Liver disease symptoms can vary but often include: yellowing of the skin (jaundice), abdominal pain and swelling, chronic fatigue, nausea or vomiting, dark urine, pale-colored stool, and loss of appetite. If you experience any of these, consult a healthcare professional."
        ],
        riskFactors: [
            "Key risk factors for liver disease include: excessive alcohol consumption, obesity, type 2 diabetes, viral hepatitis (Hepatitis B or C), family history of liver disease, certain medications, exposure to toxins, and metabolic syndrome. Maintaining a healthy lifestyle can help reduce many of these risks.",
            "Common risk factors include: heavy alcohol use, being overweight or obese, having diabetes, smoking, family history of liver problems, exposure to hepatitis viruses, and certain genetic conditions. Regular exercise and a balanced diet can help mitigate some risks."
        ],
        prevention: [
            "To prevent liver disease: limit alcohol consumption, maintain a healthy weight, eat a balanced diet rich in fruits and vegetables, exercise regularly, avoid smoking, get vaccinated for Hepatitis A and B, practice safe sex, avoid sharing needles, and be cautious with medications and supplements. Regular health checkups are also important.",
            "Prevention strategies include: drinking alcohol in moderation or not at all, maintaining a healthy BMI, eating a nutritious diet, staying physically active, avoiding illicit drugs, getting proper vaccinations, and following your doctor's advice regarding medications. Early detection through screening is also crucial."
        ],
        testResults: [
            "Liver function tests (LFTs) measure enzymes and proteins in your blood. Elevated ALT/AST levels may indicate liver damage. Normal ranges vary, but typically ALT is 7-56 IU/L and AST is 10-40 IU/L for men. Higher values suggest liver stress or damage. Always discuss results with your healthcare provider for proper interpretation.",
            "Liver function test results should be interpreted by a healthcare professional. Generally, elevated levels of ALT, AST, or bilirubin may indicate liver problems. The specific values and their significance depend on your overall health, medical history, and other factors. Don't self-diagnose based on test results alone."
        ],
        general: [
            "The liver is a vital organ that processes nutrients, filters toxins, and produces bile. Keeping it healthy is essential for overall well-being.",
            "Liver disease can be caused by various factors including viruses, alcohol use, obesity, and genetics. Early detection and treatment are key to better outcomes.",
            "If you're concerned about your liver health, consult with a healthcare professional. They can order appropriate tests and provide personalized advice."
        ],
        default: [
            "I understand your concern. For specific medical advice, please consult with a healthcare professional. I can provide general information about liver health, symptoms, risk factors, and prevention. What would you like to know?",
            "That's a good question. While I can provide general information about liver health, for personalized medical advice, it's best to consult with a healthcare provider. Is there something specific about liver disease you'd like to learn more about?"
        ]
    },

    findResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greetings
        if (message.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
            return this.getRandomResponse(this.responses.greetings);
        }
        
        // Symptoms
        if (message.match(/\b(symptom|sign|indication|feel|pain|ache|tired|fatigue|jaundice|yellow|nausea|vomit)\b/)) {
            return this.getRandomResponse(this.responses.symptoms);
        }
        
        // Risk factors
        if (message.match(/\b(risk|factor|cause|why|what causes|what leads to|preventable|avoid)\b/)) {
            return this.getRandomResponse(this.responses.riskFactors);
        }
        
        // Prevention
        if (message.match(/\b(prevent|prevention|avoid|reduce|lower|protect|healthy|diet|exercise|lifestyle)\b/)) {
            return this.getRandomResponse(this.responses.prevention);
        }
        
        // Test results
        if (message.match(/\b(test|result|alt|ast|bilirubin|liver function|blood test|lab|diagnosis|normal|abnormal|elevated|high|low)\b/)) {
            return this.getRandomResponse(this.responses.testResults);
        }
        
        // Alcohol
        if (message.match(/\b(alcohol|drink|drinking|beer|wine|spirit|liquor)\b/)) {
            return "Excessive alcohol consumption is a major risk factor for liver disease. The liver can process moderate amounts of alcohol, but heavy or chronic drinking can lead to alcoholic fatty liver disease, hepatitis, or cirrhosis. It's recommended to limit alcohol intake or avoid it altogether for optimal liver health.";
        }
        
        // Diet
        if (message.match(/\b(diet|food|eat|nutrition|meal|healthy eating|what to eat)\b/)) {
            return "A liver-friendly diet includes: plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, saturated fats, and added sugars. Foods like coffee, green tea, berries, and fatty fish may be particularly beneficial for liver health.";
        }
        
        // Exercise
        if (message.match(/\b(exercise|workout|physical activity|fitness|gym|sport)\b/)) {
            return "Regular physical activity helps maintain a healthy weight and reduces the risk of fatty liver disease. Aim for at least 150 minutes of moderate-intensity exercise per week, such as brisk walking, cycling, or swimming.";
        }
        
        // General liver health
        if (message.match(/\b(liver|hepatic|organ|function|health)\b/)) {
            return this.getRandomResponse(this.responses.general);
        }
        
        // Default response
        return this.getRandomResponse(this.responses.default);
    },

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    },

    addMessage(content, isUser = false) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Format message with line breaks for lists
        const formattedContent = content.replace(/\n/g, '<br>');
        contentDiv.innerHTML = formattedContent;
        
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Add fade-in animation
        if (window.AnimationUtils) {
            window.AnimationUtils.fadeIn(messageDiv, 300);
        }
        
        // Scroll to bottom
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    },

    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const message = input.value.trim();
        if (message === '') return;
        
        // Add user message
        this.addMessage(message, true);
        
        // Clear input
        input.value = '';
        
        // Show typing indicator (optional - could add a typing animation here)
        setTimeout(() => {
            // Get bot response
            const response = this.findResponse(message);
            
            // Add bot response with slight delay for natural feel
            this.addMessage(response, false);
        }, 500);
    },

    init() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const quickButtons = document.querySelectorAll('.quick-btn');
        
        // Send button click
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // Enter key press
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        // Quick question buttons
        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                if (question && chatInput) {
                    chatInput.value = question;
                    this.sendMessage();
                }
            });
        });
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Chatbot.init());
} else {
    Chatbot.init();
}

