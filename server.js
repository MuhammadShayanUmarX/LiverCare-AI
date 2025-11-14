/**
 * Express Server with SQLite Database
 * Handles authentication and user management
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 4000;
const PYTHON_PATH = process.env.PYTHON_PATH || 'python';
const ML_SCRIPT_PATH = path.join(__dirname, 'ml', 'predict.py');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        newsletter INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready.');
        }
    });

    // Blog posts table
    db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        image_url TEXT,
        read_time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating blog_posts table:', err.message);
        } else {
            console.log('Blog posts table ready.');
            // Insert sample blog posts if table is empty
            insertSampleBlogPosts();
        }
    });

    // Detection history table (optional - for logged in users)
    db.run(`CREATE TABLE IF NOT EXISTS detection_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        age REAL,
        gender INTEGER,
        bmi REAL,
        alcohol REAL,
        smoking INTEGER,
        genetic_risk INTEGER,
        physical_activity REAL,
        diabetes INTEGER,
        hypertension INTEGER,
        liver_function_test REAL,
        probability REAL,
        risk_level TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating detection_history table:', err.message);
        } else {
            console.log('Detection history table ready.');
        }
    });
}

// Insert sample blog posts
function insertSampleBlogPosts() {
    db.get('SELECT COUNT(*) as count FROM blog_posts', (err, row) => {
        if (err) {
            console.error('Error checking blog posts:', err.message);
            return;
        }
        
        if (row.count === 0) {
            const samplePosts = [
                {
                    title: 'Understanding Liver Function Tests: What You Need to Know',
                    excerpt: 'Learn about the different types of liver function tests, what they measure, and how to interpret your results.',
                    content: 'Full content here...',
                    category: 'research',
                    author: 'Dr. Sarah Johnson',
                    image_url: 'https://via.placeholder.com/800x400?text=Liver+Function+Tests',
                    read_time: '5 min read'
                },
                {
                    title: '10 Foods That Support Liver Health',
                    excerpt: 'Discover the best foods to include in your diet to keep your liver healthy and functioning optimally.',
                    content: 'Full content here...',
                    category: 'nutrition',
                    author: 'Nutrition Team',
                    image_url: 'https://via.placeholder.com/800x400?text=Healthy+Foods',
                    read_time: '7 min read'
                }
            ];

            const stmt = db.prepare(`INSERT INTO blog_posts 
                (title, excerpt, content, category, author, image_url, read_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`);

            samplePosts.forEach(post => {
                stmt.run([
                    post.title,
                    post.excerpt,
                    post.content,
                    post.category,
                    post.author,
                    post.image_url,
                    post.read_time
                ]);
            });

            stmt.finalize();
            console.log('Sample blog posts inserted.');
        }
    });
}

// API Routes

// User Registration
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, phone, password, newsletter } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if email already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.run(
            `INSERT INTO users (first_name, last_name, email, phone, password, newsletter) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, phone || null, hashedPassword, newsletter ? 1 : 0],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Error creating user' });
                }

                res.json({
                    success: true,
                    message: 'User registered successfully',
                    userId: this.lastID
                });
            }
        );
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, row.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user data (without password)
        res.json({
            success: true,
            user: {
                id: row.id,
                firstName: row.first_name,
                lastName: row.last_name,
                email: row.email,
                phone: row.phone
            }
        });
    });
});

// Get user by ID
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;

    db.get(
        'SELECT id, first_name, last_name, email, phone, newsletter, created_at FROM users WHERE id = ?',
        [userId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                id: row.id,
                firstName: row.first_name,
                lastName: row.last_name,
                email: row.email,
                phone: row.phone,
                newsletter: row.newsletter === 1,
                createdAt: row.created_at
            });
        }
    );
});

// Save detection history
app.post('/api/detection', (req, res) => {
    const {
        userId,
        age,
        gender,
        bmi,
        alcohol,
        smoking,
        geneticRisk,
        physicalActivity,
        diabetes,
        hypertension,
        liverFunctionTest,
        probability,
        riskLevel
    } = req.body;

    // Validate required fields
    if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    if (age === undefined || gender === undefined || bmi === undefined || 
        alcohol === undefined || smoking === undefined || geneticRisk === undefined ||
        physicalActivity === undefined || diabetes === undefined || 
        hypertension === undefined || liverFunctionTest === undefined ||
        probability === undefined || !riskLevel) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    db.run(
        `INSERT INTO detection_history 
         (user_id, age, gender, bmi, alcohol, smoking, genetic_risk, physical_activity, 
          diabetes, hypertension, liver_function_test, probability, risk_level) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            age,
            gender,
            bmi,
            alcohol,
            smoking,
            geneticRisk,
            physicalActivity,
            diabetes,
            hypertension,
            liverFunctionTest,
            probability,
            riskLevel
        ],
        function(err) {
            if (err) {
                console.error('Error saving detection history:', err);
                return res.status(500).json({ success: false, error: 'Error saving detection history: ' + err.message });
            }

            res.json({
                success: true,
                message: 'Detection history saved successfully',
                id: this.lastID
            });
        }
    );
});

// Prediction route using saved ML model
app.post('/api/predict', (req, res) => {
    const requiredFields = [
        'age',
        'gender',
        'bmi',
        'alcohol',
        'smoking',
        'geneticRisk',
        'physicalActivity',
        'diabetes',
        'hypertension',
        'liverFunctionTest'
    ];

    const payload = {};
    for (const field of requiredFields) {
        const value = req.body[field];
        if (value === undefined || value === null || value === '') {
            return res.status(400).json({ success: false, error: `Field "${field}" is required` });
        }

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) {
            return res.status(400).json({ success: false, error: `Field "${field}" must be a valid number` });
        }

        payload[field] = numericValue;
    }

    const pythonProcess = spawn(PYTHON_PATH, [ML_SCRIPT_PATH]);
    let stdoutData = '';
    let stderrData = '';
    let responded = false;

    const sendError = (status, message) => {
        if (responded) return;
        responded = true;
        return res.status(status).json({ success: false, error: message });
    };

    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    pythonProcess.on('error', (error) => {
        console.error('Python process error:', error);
        sendError(500, 'Prediction service encountered an error.');
    });

    pythonProcess.on('close', (code) => {
        if (responded) {
            return;
        }

        if (code !== 0) {
            console.error('Prediction script stderr:', stderrData || stdoutData);
            return sendError(500, 'Prediction service failed to process the request.');
        }

        try {
            const result = JSON.parse(stdoutData || '{}');
            if (!result.success) {
                const errorMessage = result.error || 'Prediction failed.';
                return sendError(500, errorMessage);
            }

            responded = true;
            return res.json({
                success: true,
                probability: result.probability,
                riskLevel: result.riskLevel
            });
        } catch (err) {
            console.error('Error parsing prediction output:', err);
            return sendError(500, 'Unable to parse prediction results.');
        }
    });

    pythonProcess.stdin.write(JSON.stringify(payload));
    pythonProcess.stdin.end();
});

// Get detection history for user
app.get('/api/detection/history/:userId', (req, res) => {
    const userId = req.params.userId;

    db.all(
        `SELECT * FROM detection_history 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json(rows);
        }
    );
});

// Get all blog posts
app.get('/api/blog/posts', (req, res) => {
    const category = req.query.category;

    let query = 'SELECT * FROM blog_posts';
    const params = [];

    if (category && category !== 'all') {
        query += ' WHERE category = ?';
        params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(rows);
    });
});

// Get single blog post
app.get('/api/blog/posts/:id', (req, res) => {
    const postId = req.params.id;

    db.get('SELECT * FROM blog_posts WHERE id = ?', [postId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(row);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

