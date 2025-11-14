/**
 * Animation Utilities
 * Provides helper functions for common animations
 */

const AnimationUtils = {
    /**
     * Animate a number from start to end
     * @param {HTMLElement} element - Element to update
     * @param {number} start - Starting value
     * @param {number} end - Ending value
     * @param {number} duration - Duration in milliseconds
     * @param {function} formatter - Optional formatter function
     */
    animateNumber(element, start, end, duration = 1000, formatter = null) {
        const startTime = performance.now();
        const difference = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (difference * easeOut);
            
            if (formatter) {
                element.textContent = formatter(current);
            } else {
                element.textContent = Math.round(current);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (formatter) {
                    element.textContent = formatter(end);
                } else {
                    element.textContent = end;
                }
            }
        };

        requestAnimationFrame(animate);
    },

    /**
     * Animate progress bar
     * @param {HTMLElement} element - Progress bar element
     * @param {number} percentage - Target percentage (0-100)
     * @param {number} duration - Duration in milliseconds
     */
    animateProgressBar(element, percentage, duration = 1000) {
        element.style.width = '0%';
        setTimeout(() => {
            element.style.width = `${percentage}%`;
        }, 50);
    },

    /**
     * Fade in element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Duration in milliseconds
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            element.style.opacity = progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    /**
     * Fade out element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in milliseconds
     */
    fadeOut(element, duration = 300) {
        const startOpacity = parseFloat(window.getComputedStyle(element).opacity);
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            element.style.opacity = startOpacity * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(animate);
    },

    /**
     * Add pulse animation to element
     * @param {HTMLElement} element - Element to pulse
     * @param {number} duration - Duration in milliseconds
     */
    pulse(element, duration = 2000) {
        element.classList.add('animate-pulse');
        setTimeout(() => {
            element.classList.remove('animate-pulse');
        }, duration);
    },

    /**
     * Add heartbeat animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {number} duration - Duration in milliseconds
     */
    heartbeat(element, duration = 1500) {
        element.classList.add('animate-heartbeat');
        setTimeout(() => {
            element.classList.remove('animate-heartbeat');
        }, duration);
    }
};

// Make available globally
window.AnimationUtils = AnimationUtils;

