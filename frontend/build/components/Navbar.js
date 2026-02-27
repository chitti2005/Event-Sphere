import { authService } from '../services/auth.js';
import { studentAuthService } from '../services/studentAuth.js';

export const Navbar = {
    render() {
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getCurrentUser();
        const student = studentAuthService.getStudent();
        const studentLabel = studentAuthService.isLoggedIn() ? `Student: ${student?.name || 'Logged In'}` : 'Student Portal';

        return `
            <div class="navbar">
                <div class="container">
                    <div class="navbar-content">
                        <a href="#events" class="navbar-brand" data-nav="events">
                            <span class="brand-icon">ES</span>
                            EventSphere
                            <span class="badge badge-primary navbar-beta-badge">Campus</span>
                        </a>

                        <div class="nav-links">
                            <a href="#events" data-nav="events" class="nav-link">Events</a>
                            <a href="#student" data-nav="student" class="nav-link">${studentLabel}</a>
                            ${isAuthenticated ? `
                                <a href="#admin" data-nav="admin" class="nav-link">Dashboard</a>
                                <span class="nav-user">${user?.username || 'admin'}</span>
                                <button class="btn-secondary nav-logout" data-action="logout">Logout</button>
                            ` : `
                                <a href="#login" data-nav="login" class="nav-link">Admin Login</a>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
