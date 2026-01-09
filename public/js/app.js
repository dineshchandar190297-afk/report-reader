// Main Application JavaScript
class HealthcareApp {
    constructor() {
        this.currentPage = 'landing';
        this.currentLanguage = 'english';
        this.currentUser = null;
        this.currentReportId = null;
        this.animationInterval = null;
        this.currentStage = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        this.startAnimation();
        this.checkAuth();
    }

    bindEvents() {
        // Skip Intro Button
        document.getElementById('skip-intro-btn')?.addEventListener('click', () => {
            this.stopAnimation();
            this.navigateTo('login');
        });

        // Get Started Button
        document.getElementById('get-started-btn')?.addEventListener('click', () => {
            this.navigateTo('login');
        });

        // Language selectors
        document.querySelectorAll('.language-dropdown').forEach(select => {
            select.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        });

        // User menu
        document.getElementById('user-menu-btn')?.addEventListener('click', () => {
            document.getElementById('user-dropdown')?.classList.toggle('show');
        });

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('user-dropdown')?.classList.remove('show');
            }
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Mode switch
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMode = btn.dataset.mode;
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                const modalId = e.target.dataset.close || e.target.closest('.modal')?.id;
                if (modalId) this.closeModal(modalId);
            });
        });
    }

    startAnimation() {
        const stages = document.querySelectorAll('.animation-stage');
        const getStartedBtn = document.getElementById('get-started-btn');
        let currentStage = 0;

        // Show first stage
        if (stages[0]) stages[0].classList.add('active');

        this.animationInterval = setInterval(() => {
            currentStage++;

            // Hide all stages
            stages.forEach(s => s.classList.remove('active'));

            if (currentStage < stages.length) {
                // Show next stage
                stages[currentStage].classList.add('active');
            } else {
                // Animation complete
                this.stopAnimation();
                getStartedBtn?.classList.remove('hidden');
            }
        }, 3000);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.classList.remove('page-enter');
        });

        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active', 'page-enter');
            this.currentPage = page;
        }
    }

    setLanguage(lang) {
        this.currentLanguage = lang;

        // Update all language dropdowns
        document.querySelectorAll('.language-dropdown').forEach(select => {
            select.value = lang;
        });

        // Update UI text based on language
        this.updateUILanguage();

        // Save preference if logged in
        if (this.currentUser) {
            fetch('/api/auth/language', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: lang })
            });
        }
    }

    updateUILanguage() {
        const lang = this.currentLanguage;
        const tr = translations[lang];

        // Update text content based on data attributes or specific elements
        // This is a simplified version - in production, use data attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (tr[key]) el.textContent = tr[key];
        });
    }

    async checkAuth() {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();

            if (data.success) {
                this.currentUser = data.user;
                this.setLanguage(data.user.preferredLanguage || 'english');
                this.updateUserUI();

                // Skip animation if already logged in
                this.stopAnimation();
                this.navigateTo('dashboard');
            }
        } catch (error) {
            console.log('Not authenticated');
        }
    }

    updateUserUI() {
        if (this.currentUser) {
            const avatar = document.getElementById('user-avatar');
            const name = document.getElementById('user-name');

            if (avatar) avatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
            if (name) name.textContent = this.currentUser.username;

            // Set mode based on role
            const modeBtn = document.querySelector(`.mode-btn[data-mode="${this.currentUser.role}"]`);
            if (modeBtn) {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                modeBtn.classList.add('active');
            }
        }
    }

    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            this.currentUser = null;
            this.showToast('Logged out successfully', 'success');
            this.navigateTo('login');
        } catch (error) {
            this.showToast('Logout failed', 'error');
        }
    }

    showLoading(text = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');

        if (loadingText) loadingText.textContent = text;
        overlay?.classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay')?.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">✕</button>
        `;

        container.appendChild(toast);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => toast.remove(), 5000);
    }

    openModal(modalId) {
        document.getElementById(modalId)?.classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    }
}

// Initialize app
const app = new HealthcareApp();
window.app = app;
