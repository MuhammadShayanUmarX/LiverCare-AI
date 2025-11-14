/**
 * Blog Module
 * Handles blog listing, filtering, and individual post display
 */

const Blog = {
    // Sample blog posts data (in production, this would come from an API)
    posts: [
        {
            id: 1,
            title: "Understanding Liver Function Tests: What You Need to Know",
            excerpt: "Learn about the different types of liver function tests, what they measure, and how to interpret your results.",
            content: `
                <h2>Understanding Liver Function Tests</h2>
                <p>Liver function tests (LFTs) are blood tests that help diagnose and monitor liver disease or damage. These tests measure the levels of certain enzymes and proteins in your blood.</p>
                
                <h3>Common Liver Function Tests</h3>
                <ul>
                    <li><strong>ALT (Alanine Aminotransferase):</strong> An enzyme found primarily in the liver. Elevated levels may indicate liver damage.</li>
                    <li><strong>AST (Aspartate Aminotransferase):</strong> An enzyme found in the liver and other organs. High levels can indicate liver or muscle damage.</li>
                    <li><strong>Bilirubin:</strong> A waste product from the breakdown of red blood cells. High levels can cause jaundice.</li>
                    <li><strong>Albumin:</strong> A protein made by the liver. Low levels may indicate liver disease.</li>
                    <li><strong>Prothrombin Time:</strong> Measures how long it takes for blood to clot. Prolonged times may indicate liver problems.</li>
                </ul>
                
                <h3>What Do Abnormal Results Mean?</h3>
                <p>Abnormal liver function test results don't always mean you have liver disease. Many factors can affect these tests, including medications, alcohol consumption, and other medical conditions. Always consult with your healthcare provider to interpret your results properly.</p>
                
                <h3>When to Get Tested</h3>
                <p>Your doctor may recommend liver function tests if you:</p>
                <ul>
                    <li>Have symptoms of liver disease</li>
                    <li>Have a family history of liver disease</li>
                    <li>Take medications that may affect the liver</li>
                    <li>Have diabetes or other metabolic conditions</li>
                    <li>Consume alcohol regularly</li>
                </ul>
            `,
            category: "research",
            author: "Dr. Sarah Johnson",
            date: "2024-01-15",
            image: "https://via.placeholder.com/800x400?text=Liver+Function+Tests",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "10 Foods That Support Liver Health",
            excerpt: "Discover the best foods to include in your diet to keep your liver healthy and functioning optimally.",
            content: `
                <h2>10 Foods That Support Liver Health</h2>
                <p>Your liver plays a crucial role in processing nutrients, filtering toxins, and producing bile. Here are 10 foods that can help keep your liver healthy:</p>
                
                <h3>1. Coffee</h3>
                <p>Studies show that coffee can help protect against liver disease, including reducing the risk of liver cancer and cirrhosis.</p>
                
                <h3>2. Green Tea</h3>
                <p>Rich in antioxidants, green tea may help reduce fat accumulation in the liver and improve liver enzyme levels.</p>
                
                <h3>3. Grapefruit</h3>
                <p>Contains antioxidants that help protect the liver. Naringenin and naringin are two antioxidants found in grapefruit.</p>
                
                <h3>4. Blueberries and Cranberries</h3>
                <p>These berries are rich in antioxidants called anthocyanins, which may help protect the liver from damage.</p>
                
                <h3>5. Grapes</h3>
                <p>Grapes, especially red and purple varieties, contain resveratrol, which may help reduce inflammation and protect the liver.</p>
                
                <h3>6. Prickly Pear</h3>
                <p>This fruit may help reduce symptoms of a hangover and protect the liver from alcohol-induced damage.</p>
                
                <h3>7. Beetroot Juice</h3>
                <p>Beetroot juice is rich in nitrates and antioxidants that may help reduce inflammation and oxidative damage to the liver.</p>
                
                <h3>8. Cruciferous Vegetables</h3>
                <p>Broccoli, Brussels sprouts, and other cruciferous vegetables contain compounds that help the liver produce detoxifying enzymes.</p>
                
                <h3>9. Nuts</h3>
                <p>Nuts are high in healthy fats, antioxidants, and vitamin E, which may help protect against non-alcoholic fatty liver disease.</p>
                
                <h3>10. Fatty Fish</h3>
                <p>Fish like salmon and mackerel are rich in omega-3 fatty acids, which may help reduce inflammation and prevent fat accumulation in the liver.</p>
            `,
            category: "nutrition",
            author: "Nutrition Team",
            date: "2024-01-10",
            image: "https://via.placeholder.com/800x400?text=Healthy+Foods",
            readTime: "7 min read"
        },
        {
            id: 3,
            title: "Early Signs and Symptoms of Liver Disease",
            excerpt: "Recognizing the early warning signs of liver disease can help you seek treatment sooner and improve outcomes.",
            content: `
                <h2>Early Signs and Symptoms of Liver Disease</h2>
                <p>Liver disease often develops silently, with few or no symptoms in the early stages. However, being aware of potential warning signs can help you catch problems early.</p>
                
                <h3>Common Early Symptoms</h3>
                <ul>
                    <li><strong>Fatigue:</strong> Persistent tiredness that doesn't improve with rest</li>
                    <li><strong>Nausea and Vomiting:</strong> Feeling sick to your stomach, especially after eating</li>
                    <li><strong>Loss of Appetite:</strong> Not feeling hungry or losing interest in food</li>
                    <li><strong>Abdominal Pain:</strong> Discomfort or pain in the upper right abdomen</li>
                    <li><strong>Dark Urine:</strong> Urine that is darker than usual</li>
                    <li><strong>Pale Stool:</strong> Stools that are lighter in color than normal</li>
                </ul>
                
                <h3>More Advanced Symptoms</h3>
                <ul>
                    <li><strong>Jaundice:</strong> Yellowing of the skin and eyes</li>
                    <li><strong>Swelling:</strong> Swelling in the legs, ankles, or abdomen</li>
                    <li><strong>Easy Bruising:</strong> Bruising more easily than usual</li>
                    <li><strong>Itchy Skin:</strong> Persistent itching without a rash</li>
                    <li><strong>Confusion:</strong> Mental confusion or difficulty concentrating</li>
                </ul>
                
                <h3>When to See a Doctor</h3>
                <p>If you experience any of these symptoms, especially if they persist or worsen, it's important to consult with a healthcare professional. Early detection and treatment can significantly improve outcomes.</p>
            `,
            category: "symptoms",
            author: "Dr. Michael Chen",
            date: "2024-01-05",
            image: "https://via.placeholder.com/800x400?text=Liver+Symptoms",
            readTime: "6 min read"
        },
        {
            id: 4,
            title: "Preventing Liver Disease: A Comprehensive Guide",
            excerpt: "Learn practical steps you can take to reduce your risk of developing liver disease and maintain optimal liver health.",
            content: `
                <h2>Preventing Liver Disease: A Comprehensive Guide</h2>
                <p>Prevention is always better than cure. Here are evidence-based strategies to protect your liver health:</p>
                
                <h3>1. Limit Alcohol Consumption</h3>
                <p>Excessive alcohol consumption is a leading cause of liver disease. The liver can process moderate amounts of alcohol, but heavy or chronic drinking can lead to alcoholic fatty liver disease, hepatitis, or cirrhosis.</p>
                <p><strong>Recommendation:</strong> Limit alcohol to no more than one drink per day for women and two drinks per day for men.</p>
                
                <h3>2. Maintain a Healthy Weight</h3>
                <p>Obesity is a major risk factor for non-alcoholic fatty liver disease (NAFLD). Maintaining a healthy weight through diet and exercise can significantly reduce your risk.</p>
                
                <h3>3. Eat a Balanced Diet</h3>
                <p>A diet rich in fruits, vegetables, whole grains, and lean proteins supports liver health. Limit processed foods, saturated fats, and added sugars.</p>
                
                <h3>4. Exercise Regularly</h3>
                <p>Regular physical activity helps maintain a healthy weight and reduces the risk of fatty liver disease. Aim for at least 150 minutes of moderate-intensity exercise per week.</p>
                
                <h3>5. Get Vaccinated</h3>
                <p>Vaccines are available for Hepatitis A and Hepatitis B, both of which can cause liver disease. Talk to your doctor about getting vaccinated.</p>
                
                <h3>6. Practice Safe Sex</h3>
                <p>Hepatitis B and C can be transmitted through sexual contact. Using protection and getting tested regularly can help prevent transmission.</p>
                
                <h3>7. Avoid Sharing Needles</h3>
                <p>Never share needles or other drug paraphernalia, as this can transmit hepatitis viruses.</p>
                
                <h3>8. Be Cautious with Medications</h3>
                <p>Some medications can be harmful to the liver, especially when taken in high doses or combined with alcohol. Always follow your doctor's instructions and never exceed recommended dosages.</p>
                
                <h3>9. Regular Health Checkups</h3>
                <p>Regular checkups can help detect liver problems early, when they're most treatable. Discuss liver health screening with your healthcare provider.</p>
            `,
            category: "prevention",
            author: "Health Education Team",
            date: "2024-01-01",
            image: "https://via.placeholder.com/800x400?text=Prevention",
            readTime: "8 min read"
        },
        {
            id: 5,
            title: "Latest Research in Liver Disease Detection",
            excerpt: "Stay updated on the latest advances in liver disease detection, including AI and machine learning applications.",
            content: `
                <h2>Latest Research in Liver Disease Detection</h2>
                <p>The field of liver disease detection is rapidly evolving, with new technologies and methods being developed to improve early diagnosis and treatment outcomes.</p>
                
                <h3>AI and Machine Learning</h3>
                <p>Artificial intelligence and machine learning are revolutionizing liver disease detection. These technologies can analyze complex patterns in medical data that might be missed by traditional methods.</p>
                <p>Recent studies have shown that ensemble machine learning models, combining multiple algorithms like Random Forest, XGBoost, and Neural Networks, can achieve accuracy rates above 97% in detecting liver disease.</p>
                
                <h3>Non-Invasive Testing</h3>
                <p>Researchers are developing non-invasive methods to assess liver health, reducing the need for invasive procedures like liver biopsies. These include:</p>
                <ul>
                    <li>Elastography techniques to measure liver stiffness</li>
                    <li>Blood-based biomarkers for early detection</li>
                    <li>Imaging techniques with enhanced sensitivity</li>
                </ul>
                
                <h3>Personalized Medicine</h3>
                <p>Advances in genomics are enabling more personalized approaches to liver disease prevention and treatment. Genetic testing can help identify individuals at higher risk and guide treatment decisions.</p>
                
                <h3>Future Directions</h3>
                <p>Ongoing research is focusing on:</p>
                <ul>
                    <li>Early biomarkers for liver disease</li>
                    <li>Improved imaging techniques</li>
                    <li>Novel therapeutic approaches</li>
                    <li>Precision medicine applications</li>
                </ul>
            `,
            category: "research",
            author: "Research Team",
            date: "2023-12-20",
            image: "https://via.placeholder.com/800x400?text=Research",
            readTime: "6 min read"
        }
    ],

    // Render blog posts
    renderPosts(posts = this.posts) {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        blogGrid.innerHTML = '';

        if (posts.length === 0) {
            blogGrid.innerHTML = '<p class="no-posts">No articles found in this category.</p>';
            return;
        }

        posts.forEach((post, index) => {
            const postCard = document.createElement('article');
            postCard.className = 'blog-card scroll-reveal';
            postCard.style.animationDelay = `${index * 0.1}s`;
            postCard.innerHTML = `
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-author">${post.author}</span>
                        <span class="blog-date">${new Date(post.date).toLocaleDateString()}</span>
                        <span class="blog-read-time">${post.readTime}</span>
                    </div>
                    <h3 class="blog-card-title">
                        <a href="blog-post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <a href="blog-post.html?id=${post.id}" class="blog-read-more">Read More →</a>
                </div>
            `;
            blogGrid.appendChild(postCard);
        });

        // Re-observe for scroll animations
        if (window.scrollObserver) {
            setTimeout(() => {
                window.scrollObserver.observeAll('.blog-card');
            }, 100);
        }
    },

    // Filter posts by category
    filterPosts(category) {
        if (category === 'all') {
            this.renderPosts();
        } else {
            const filtered = this.posts.filter(post => post.category === category);
            this.renderPosts(filtered);
        }
    },

    // Render individual blog post
    renderPost(postId) {
        const post = this.posts.find(p => p.id === parseInt(postId));
        const blogPost = document.getElementById('blogPost');
        const relatedPosts = this.posts
            .filter(p => p.id !== parseInt(postId) && p.category === post.category)
            .slice(0, 3);

        if (!post || !blogPost) {
            window.location.href = 'blog.html';
            return;
        }

        blogPost.innerHTML = `
            <div class="blog-post-header">
                <span class="blog-post-category">${post.category}</span>
                <h1 class="blog-post-title">${post.title}</h1>
                <div class="blog-post-meta">
                    <span class="blog-post-author">By ${post.author}</span>
                    <span class="blog-post-date">${new Date(post.date).toLocaleDateString()}</span>
                    <span class="blog-post-read-time">${post.readTime}</span>
                </div>
            </div>
            <div class="blog-post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-post-content">
                ${post.content}
            </div>
        `;

        // Render related posts
        const relatedPostsContainer = document.getElementById('relatedPosts');
        if (relatedPostsContainer && relatedPosts.length > 0) {
            relatedPostsContainer.innerHTML = relatedPosts.map(relatedPost => `
                <div class="related-post">
                    <h4><a href="blog-post.html?id=${relatedPost.id}">${relatedPost.title}</a></h4>
                    <p class="related-post-meta">${new Date(relatedPost.date).toLocaleDateString()} • ${relatedPost.readTime}</p>
                </div>
            `).join('');
        }
    },

    init() {
        // Check if we're on blog post page
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (postId) {
            this.renderPost(postId);
            return;
        }

        // Setup category filter
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterPosts(btn.dataset.category);
            });
        });

        // Check for category in URL
        const category = urlParams.get('category');
        if (category) {
            const categoryBtn = document.querySelector(`[data-category="${category}"]`);
            if (categoryBtn) {
                filterButtons.forEach(b => b.classList.remove('active'));
                categoryBtn.classList.add('active');
                this.filterPosts(category);
            } else {
                this.renderPosts();
            }
        } else {
            this.renderPosts();
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Blog.init());
} else {
    Blog.init();
}

