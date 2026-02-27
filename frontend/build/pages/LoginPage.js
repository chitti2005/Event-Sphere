import { authService } from '../services/auth.js';

export const LoginPage = {
    render() {
        return `
            <div class="page login-page">
                <div class="container">
                    <div class="login-container">
                        <div class="login-card">
                            <div class="login-header">
                                <h1>Admin Login</h1>
                                <p>Use your administrator credentials to manage events.</p>
                            </div>

                            <form id="login-form" class="login-form">
                                <div class="form-group">
                                    <label for="username">Username</label>
                                    <input type="text" id="username" autocomplete="username" required />
                                </div>

                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" id="password" autocomplete="current-password" required />
                                </div>

                                <div class="form-group remember-row">
                                    <label class="checkbox-wrap">
                                        <input type="checkbox" id="remember" checked />
                                        <span>Remember me for 7 days</span>
                                    </label>
                                </div>

                                <button type="submit" class="submit-btn">Login</button>
                            </form>

                            <div id="login-message" class="form-message"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender(onSuccess) {
        const form = document.getElementById('login-form');
        const message = document.getElementById('login-message');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            const result = authService.login(username, password, remember);
            if (!result.success) {
                message.textContent = result.message;
                message.className = 'form-message error';
                return;
            }

            message.textContent = 'Login successful. Redirecting...';
            message.className = 'form-message success';

            setTimeout(() => {
                if (typeof onSuccess === 'function') onSuccess();
                window.location.hash = '#admin';
            }, 500);
        });
    }
};
