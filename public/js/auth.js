// Authentication JavaScript
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindLoginForm();
        this.bindSignupForm();
        this.bindPasswordToggles();
        this.bindPasswordValidation();
        this.bindNavigationLinks();
        this.bindForgotPassword();
    }

    bindLoginForm() {
        const form = document.getElementById('login-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                app.showToast('Please fill in all fields', 'warning');
                return;
            }

            app.showLoading('Signing in...');

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    app.currentUser = data.user;
                    app.updateUserUI();
                    app.showToast('Login successful!', 'success');
                    app.navigateTo('dashboard');

                    // Initialize dashboard
                    if (window.dashboard) {
                        dashboard.loadReports();
                    }
                } else {
                    app.showToast(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                app.showToast('Login failed. Please try again.', 'error');
            } finally {
                app.hideLoading();
            }
        });
    }

    bindSignupForm() {
        const form = document.getElementById('signup-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                role: document.querySelector('input[name="role"]:checked')?.value,
                username: document.getElementById('signup-username').value,
                email: document.getElementById('signup-email').value,
                mobile: document.getElementById('signup-mobile').value,
                dateOfBirth: document.getElementById('signup-dob').value,
                gender: document.getElementById('signup-gender').value,
                password: document.getElementById('signup-password').value,
                confirmPassword: document.getElementById('signup-confirm-password').value
            };

            // Validate all fields
            if (!formData.role || !formData.username || !formData.email ||
                !formData.mobile || !formData.dateOfBirth || !formData.gender ||
                !formData.password || !formData.confirmPassword) {
                app.showToast('Please fill in all fields', 'warning');
                return;
            }

            // Validate password match
            if (formData.password !== formData.confirmPassword) {
                app.showToast('Passwords do not match', 'error');
                return;
            }

            // Validate password strength
            const validation = this.validatePassword(formData.password);
            if (!validation.valid) {
                app.showToast('Password does not meet requirements', 'error');
                return;
            }

            app.showLoading('Creating account...');

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    app.showToast('Account created successfully!', 'success');
                    form.reset();
                    app.navigateTo('login');
                } else {
                    app.showToast(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                app.showToast('Registration failed. Please try again.', 'error');
            } finally {
                app.hideLoading();
            }
        });
    }

    bindPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const wrapper = btn.closest('.password-input-wrapper');
                const input = wrapper.querySelector('input');
                const eyeOpen = btn.querySelector('.eye-open');
                const eyeClosed = btn.querySelector('.eye-closed');

                if (input.type === 'password') {
                    input.type = 'text';
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                } else {
                    input.type = 'password';
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                }
            });
        });
    }

    bindPasswordValidation() {
        const passwordInput = document.getElementById('signup-password');
        const confirmInput = document.getElementById('signup-confirm-password');
        const strengthFill = document.getElementById('password-strength-fill');
        const requirements = document.querySelectorAll('.requirement');
        const matchIndicator = document.getElementById('password-match');

        passwordInput?.addEventListener('input', () => {
            const password = passwordInput.value;
            const validation = this.validatePassword(password);

            // Update requirements
            requirements.forEach(req => {
                const reqType = req.dataset.req;
                if (validation[reqType]) {
                    req.classList.add('valid');
                } else {
                    req.classList.remove('valid');
                }
            });

            // Update strength bar
            const strength = Object.values(validation).filter(v => v === true).length;
            strengthFill.className = 'strength-fill';

            if (strength === 1) strengthFill.classList.add('weak');
            else if (strength === 2) strengthFill.classList.add('fair');
            else if (strength === 3) strengthFill.classList.add('good');
            else if (strength >= 4) strengthFill.classList.add('strong');

            // Check match
            this.checkPasswordMatch();
        });

        confirmInput?.addEventListener('input', () => {
            this.checkPasswordMatch();
        });
    }

    checkPasswordMatch() {
        const password = document.getElementById('signup-password')?.value;
        const confirm = document.getElementById('signup-confirm-password')?.value;
        const indicator = document.getElementById('password-match');

        if (!indicator || !confirm) return;

        if (password === confirm && password.length > 0) {
            indicator.textContent = '✓ Passwords match';
            indicator.className = 'password-match-indicator match';
        } else if (confirm.length > 0) {
            indicator.textContent = '✕ Passwords do not match';
            indicator.className = 'password-match-indicator no-match';
        } else {
            indicator.textContent = '';
        }
    }

    validatePassword(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            valid: password.length >= 8 && /[A-Z]/.test(password) &&
                /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    }

    bindNavigationLinks() {
        // Create account link
        document.getElementById('create-account-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            app.navigateTo('signup');
        });

        // Login link
        document.getElementById('login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            app.navigateTo('login');
        });

        // Forgot password link
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            app.openModal('forgot-password-modal');
        });
    }

    bindForgotPassword() {
        const form = document.getElementById('forgot-password-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('reset-email').value;

            if (!email) {
                app.showToast('Please enter your email', 'warning');
                return;
            }

            app.showLoading('Sending reset link...');

            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                app.showToast(data.message, 'info');
                app.closeModal('forgot-password-modal');
                form.reset();
            } catch (error) {
                app.showToast('Request failed', 'error');
            } finally {
                app.hideLoading();
            }
        });
    }
}

// Initialize auth manager
const authManager = new AuthManager();
window.authManager = authManager;
