/**
 * Authentication Module
 * Handles login, signup, and comprehensive form validation
 */

const Auth = {
    // Validation patterns
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]+$/,
        password: {
            minLength: 8,
            hasUpperCase: /[A-Z]/,
            hasLowerCase: /[a-z]/,
            hasNumber: /\d/,
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
        },
        name: /^[a-zA-Z\s'-]+$/
    },

    // Clear error messages
    clearError(fieldId) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        const input = document.getElementById(fieldId.replace('Error', ''));
        if (input) {
            input.classList.remove('error');
        }
    },

    // Show error message
    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        const input = document.getElementById(fieldId.replace('Error', ''));
        if (input) {
            input.classList.add('error');
        }
    },

    // Validate email
    validateEmail(email, errorId) {
        if (!email) {
            this.showError(errorId, 'Email is required');
            return false;
        }
        if (!this.patterns.email.test(email)) {
            this.showError(errorId, 'Please enter a valid email address');
            return false;
        }
        this.clearError(errorId);
        return true;
    },

    // Validate password
    validatePassword(password, errorId, isSignup = false) {
        if (!password) {
            this.showError(errorId, 'Password is required');
            return false;
        }

        if (isSignup) {
            if (password.length < this.patterns.password.minLength) {
                this.showError(errorId, `Password must be at least ${this.patterns.password.minLength} characters long`);
                return false;
            }
            if (!this.patterns.password.hasUpperCase.test(password)) {
                this.showError(errorId, 'Password must contain at least one uppercase letter');
                return false;
            }
            if (!this.patterns.password.hasLowerCase.test(password)) {
                this.showError(errorId, 'Password must contain at least one lowercase letter');
                return false;
            }
            if (!this.patterns.password.hasNumber.test(password)) {
                this.showError(errorId, 'Password must contain at least one number');
                return false;
            }
            if (!this.patterns.password.hasSpecialChar.test(password)) {
                this.showError(errorId, 'Password must contain at least one special character');
                return false;
            }
        }

        this.clearError(errorId);
        return true;
    },

    // Calculate password strength
    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (this.patterns.password.hasUpperCase.test(password)) strength++;
        if (this.patterns.password.hasLowerCase.test(password)) strength++;
        if (this.patterns.password.hasNumber.test(password)) strength++;
        if (this.patterns.password.hasSpecialChar.test(password)) strength++;

        if (strength <= 2) return { level: 'weak', percentage: 33, color: '#C5E1A5' };
        if (strength <= 4) return { level: 'medium', percentage: 66, color: '#8BC34A' };
        return { level: 'strong', percentage: 100, color: '#0B6623' };
    },

    // Update password strength indicator
    updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const strengthLevel = document.getElementById('strengthLevel');

        if (!strengthFill || !strengthText || !strengthLevel) return;

        if (!password) {
            strengthFill.style.width = '0%';
            strengthLevel.textContent = 'Weak';
            return;
        }

        const strength = this.calculatePasswordStrength(password);
        strengthFill.style.width = `${strength.percentage}%`;
        strengthFill.style.backgroundColor = strength.color;
        strengthLevel.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
        strengthLevel.style.color = strength.color;
    },

    // Validate name
    validateName(name, errorId, fieldName) {
        if (!name) {
            this.showError(errorId, `${fieldName} is required`);
            return false;
        }
        if (name.length < 2) {
            this.showError(errorId, `${fieldName} must be at least 2 characters`);
            return false;
        }
        if (!this.patterns.name.test(name)) {
            this.showError(errorId, `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
            return false;
        }
        this.clearError(errorId);
        return true;
    },

    // Validate phone
    validatePhone(phone, errorId) {
        if (phone && !this.patterns.phone.test(phone)) {
            this.showError(errorId, 'Please enter a valid phone number');
            return false;
        }
        this.clearError(errorId);
        return true;
    },

    // Validate password confirmation
    validatePasswordConfirmation(password, confirmPassword, errorId) {
        if (!confirmPassword) {
            this.showError(errorId, 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            this.showError(errorId, 'Passwords do not match');
            return false;
        }
        this.clearError(errorId);
        return true;
    },

    // Toggle password visibility
    togglePasswordVisibility(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        if (!input || !toggle) return;

        toggle.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggle.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
        });
    },

    // Handle login
    handleLogin(e) {
        e.preventDefault();
        const form = document.getElementById('loginForm');
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        const submitBtn = document.getElementById('loginBtn');

        // Clear previous errors
        this.clearError('emailError');
        this.clearError('passwordError');
        if (errorDiv) errorDiv.style.display = 'none';

        // Validate
        let isValid = true;
        if (!this.validateEmail(email, 'emailError')) isValid = false;
        if (!this.validatePassword(password, 'passwordError')) isValid = false;

        if (!isValid) return;

        // Show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // API call to login
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store session
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error
                if (errorDiv) {
                    errorDiv.textContent = data.error || 'Invalid email or password';
                    errorDiv.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            // Fallback to localStorage for demo
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }));
                window.location.href = 'dashboard.html';
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Invalid email or password';
                    errorDiv.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    },

    // Handle signup
    handleSignup(e) {
        e.preventDefault();
        const form = document.getElementById('signupForm');
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const errorDiv = document.getElementById('signupError');
        const submitBtn = document.getElementById('signupBtn');

        // Clear previous errors
        ['firstNameError', 'lastNameError', 'signupEmailError', 'phoneError', 
         'signupPasswordError', 'confirmPasswordError', 'termsError'].forEach(id => {
            this.clearError(id);
        });
        if (errorDiv) errorDiv.style.display = 'none';

        // Validate
        let isValid = true;
        if (!this.validateName(firstName, 'firstNameError', 'First name')) isValid = false;
        if (!this.validateName(lastName, 'lastNameError', 'Last name')) isValid = false;
        if (!this.validateEmail(email, 'signupEmailError')) isValid = false;
        if (!this.validatePhone(phone, 'phoneError')) isValid = false;
        if (!this.validatePassword(password, 'signupPasswordError', true)) isValid = false;
        if (!this.validatePasswordConfirmation(password, confirmPassword, 'confirmPasswordError')) isValid = false;
        
        if (!terms) {
            this.showError('termsError', 'You must agree to the terms and conditions');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // API call to register
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone: phone || null,
                password,
                newsletter: document.getElementById('newsletter').checked
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store session
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: data.userId,
                    email,
                    firstName,
                    lastName
                }));
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error
                if (data.error && data.error.includes('Email')) {
                    this.showError('signupEmailError', data.error);
                } else if (errorDiv) {
                    errorDiv.textContent = data.error || 'Registration failed';
                    errorDiv.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
            // Fallback to localStorage for demo
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === email)) {
                this.showError('signupEmailError', 'This email is already registered');
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                firstName,
                lastName,
                email,
                phone: phone || null,
                password,
                createdAt: new Date().toISOString(),
                newsletter: document.getElementById('newsletter').checked
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            sessionStorage.setItem('currentUser', JSON.stringify({
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }));

            window.location.href = 'dashboard.html';
        });
    },

    // Real-time validation
    setupRealTimeValidation() {
        // Login email
        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) {
            loginEmail.addEventListener('blur', () => {
                this.validateEmail(loginEmail.value.trim(), 'emailError');
            });
            loginEmail.addEventListener('input', () => {
                this.clearError('emailError');
            });
        }

        // Signup email
        const signupEmail = document.getElementById('signupEmail');
        if (signupEmail) {
            signupEmail.addEventListener('blur', () => {
                this.validateEmail(signupEmail.value.trim(), 'signupEmailError');
            });
            signupEmail.addEventListener('input', () => {
                this.clearError('signupEmailError');
            });
        }

        // Signup password
        const signupPassword = document.getElementById('signupPassword');
        if (signupPassword) {
            signupPassword.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
                this.clearError('signupPasswordError');
            });
            signupPassword.addEventListener('blur', () => {
                this.validatePassword(signupPassword.value, 'signupPasswordError', true);
            });
        }

        // Confirm password
        const confirmPassword = document.getElementById('confirmPassword');
        const signupPasswordField = document.getElementById('signupPassword');
        if (confirmPassword && signupPasswordField) {
            confirmPassword.addEventListener('input', () => {
                if (signupPasswordField.value) {
                    this.validatePasswordConfirmation(
                        signupPasswordField.value,
                        confirmPassword.value,
                        'confirmPasswordError'
                    );
                }
            });
        }

        // Names
        ['firstName', 'lastName'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => {
                    const fieldName = field === 'firstName' ? 'First name' : 'Last name';
                    this.validateName(input.value.trim(), `${field}Error`, fieldName);
                });
                input.addEventListener('input', () => {
                    this.clearError(`${field}Error`);
                });
            }
        });

        // Phone
        const phone = document.getElementById('phone');
        if (phone) {
            phone.addEventListener('blur', () => {
                this.validatePhone(phone.value.trim(), 'phoneError');
            });
            phone.addEventListener('input', () => {
                this.clearError('phoneError');
            });
        }
    },

    init() {
        // Setup password toggles
        this.togglePasswordVisibility('loginPassword', 'togglePassword');
        this.togglePasswordVisibility('signupPassword', 'toggleSignupPassword');
        this.togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');

        // Setup real-time validation
        this.setupRealTimeValidation();

        // Setup form handlers
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Auth.init());
} else {
    Auth.init();
}

