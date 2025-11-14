/**
 * Home Page Module
 * Handles FAQ accordion and other home page interactions
 */

const Home = {
    init() {
        this.initFAQ();
    },

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            if (!question || !answer || !toggle) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherToggle) otherToggle.textContent = '+';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    toggle.textContent = '+';
                    if (window.AnimationUtils) {
                        window.AnimationUtils.fadeOut(answer, 300);
                    }
                } else {
                    item.classList.add('active');
                    toggle.textContent = '−';
                    if (window.AnimationUtils) {
                        window.AnimationUtils.fadeIn(answer, 300);
                    }
                }
            });
        });
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Home.init());
} else {
    Home.init();
}

