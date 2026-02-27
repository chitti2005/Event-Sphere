/**
 * Authentication service.
 */

const AUTH_KEY = 'auth';
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

function safeParse(value) {
    try {
        return JSON.parse(value);
    } catch (_) {
        return null;
    }
}

export const authService = {
    login(username, password, remember = true) {
        if (username !== 'admin' || password !== 'admin123') {
            return { success: false, message: 'Invalid credentials' };
        }

        const auth = {
            authenticated: true,
            username,
            timestamp: Date.now()
        };

        if (remember) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
            sessionStorage.removeItem(AUTH_KEY);
        } else {
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
            localStorage.removeItem(AUTH_KEY);
        }

        return { success: true };
    },

    isAuthenticated() {
        const persistentAuth = safeParse(localStorage.getItem(AUTH_KEY));
        if (persistentAuth) {
            if (Date.now() - persistentAuth.timestamp < WEEK_IN_MS) {
                return persistentAuth.authenticated === true;
            }
            localStorage.removeItem(AUTH_KEY);
        }

        const sessionAuth = safeParse(sessionStorage.getItem(AUTH_KEY));
        return !!sessionAuth?.authenticated;
    },

    getCurrentUser() {
        const persistentAuth = safeParse(localStorage.getItem(AUTH_KEY));
        if (persistentAuth) return persistentAuth;
        return safeParse(sessionStorage.getItem(AUTH_KEY));
    },

    logout() {
        localStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_KEY);
    }
};
