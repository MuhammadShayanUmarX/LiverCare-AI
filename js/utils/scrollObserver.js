/**
 * Scroll Observer Utility
 * Handles scroll-triggered animations using Intersection Observer API
 */

class ScrollObserver {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
        };
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersect.bind(this),
                this.options
            );
        }
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after animation
                if (entry.target.dataset.observeOnce !== 'false') {
                    this.observer.unobserve(entry.target);
                }
            }
        });
    }

    observe(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }

    observeAll(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            this.observe(element);
        });
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize scroll observer on page load
document.addEventListener('DOMContentLoaded', () => {
    const scrollObserver = new ScrollObserver();
    
    // Observe all elements with scroll-reveal class
    scrollObserver.observeAll('.scroll-reveal');
    
    // Observe feature cards with stagger animation
    const featureCards = document.querySelectorAll('.feature-card, .step-card, .stat-card');
    featureCards.forEach((card, index) => {
        card.classList.add('scroll-reveal');
        card.style.animationDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });
    
    // Make scrollObserver available globally for custom use
    window.scrollObserver = scrollObserver;
});

