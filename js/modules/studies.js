/**
 * Studies Module
 * Manages liver-related research studies and articles
 */

const Studies = {
    studies: [
        {
            id: 1,
            title: "Machine Learning in Liver Disease Diagnosis: A Systematic Review",
            authors: "Dr. A. Smith, Dr. B. Johnson",
            journal: "Journal of Medical AI",
            year: 2024,
            category: "diagnosis",
            summary: "Comprehensive review of ML applications in liver disease detection, analyzing 50+ studies and comparing various algorithms.",
            link: "#"
        },
        {
            id: 2,
            title: "Non-Alcoholic Fatty Liver Disease: Prevalence and Risk Factors",
            authors: "Dr. C. Williams, Dr. D. Brown",
            journal: "Hepatology Research",
            year: 2023,
            category: "prevention",
            summary: "Large-scale study examining NAFLD prevalence across different demographics and identifying key modifiable risk factors.",
            link: "#"
        },
        {
            id: 3,
            title: "Early Detection of Liver Cirrhosis Using Ensemble Learning",
            authors: "Dr. E. Davis, Dr. F. Miller",
            journal: "Clinical AI Applications",
            year: 2024,
            category: "diagnosis",
            summary: "Novel approach using ensemble methods to detect early-stage cirrhosis with 95%+ accuracy, enabling timely intervention.",
            link: "#"
        },
        {
            id: 4,
            title: "Impact of Lifestyle Modifications on Liver Health",
            authors: "Dr. G. Wilson, Dr. H. Moore",
            journal: "Preventive Medicine",
            year: 2023,
            category: "prevention",
            summary: "Longitudinal study showing significant improvement in liver function markers following structured lifestyle interventions.",
            link: "#"
        },
        {
            id: 5,
            title: "Deep Learning for Liver Function Test Interpretation",
            authors: "Dr. I. Taylor, Dr. J. Anderson",
            journal: "AI in Healthcare",
            year: 2024,
            category: "diagnosis",
            summary: "Deep neural networks trained on 10,000+ patient records to interpret complex liver function test patterns.",
            link: "#"
        },
        {
            id: 6,
            title: "Hepatitis B and C: Screening and Prevention Strategies",
            authors: "Dr. K. Thomas, Dr. L. Jackson",
            journal: "Infectious Disease Research",
            year: 2023,
            category: "prevention",
            summary: "Evidence-based guidelines for viral hepatitis screening and prevention in high-risk populations.",
            link: "#"
        }
    ],

    renderStudies() {
        const studiesGrid = document.getElementById('studiesGrid');
        if (!studiesGrid) return;

        studiesGrid.innerHTML = '';

        this.studies.forEach((study, index) => {
            const studyCard = document.createElement('article');
            studyCard.className = 'study-card scroll-reveal';
            studyCard.style.animationDelay = `${index * 0.1}s`;
            
            const categoryColors = {
                diagnosis: 'var(--primary-color)',
                prevention: 'var(--accent-color)',
                treatment: 'var(--warning-color)'
            };

            studyCard.innerHTML = `
                <div class="study-header">
                    <span class="study-category" style="background: ${categoryColors[study.category] || '#666'}">
                        ${study.category.charAt(0).toUpperCase() + study.category.slice(1)}
                    </span>
                    <span class="study-year">${study.year}</span>
                </div>
                <h3 class="study-title">${study.title}</h3>
                <p class="study-authors">${study.authors}</p>
                <p class="study-journal">${study.journal}</p>
                <p class="study-summary">${study.summary}</p>
                <a href="${study.link}" class="study-link">Read Full Study →</a>
            `;

            studiesGrid.appendChild(studyCard);
        });

        // Re-observe for scroll animations
        if (window.scrollObserver) {
            setTimeout(() => {
                window.scrollObserver.observeAll('.study-card');
            }, 100);
        }
    },

    init() {
        this.renderStudies();
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Studies.init());
} else {
    Studies.init();
}

