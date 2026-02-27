const STUDENT_SESSION_KEY = 'studentSession';

function safeParse(value) {
    try {
        return JSON.parse(value);
    } catch (_) {
        return null;
    }
}

export const studentAuthService = {
    login({ name, email, department = '', year = '' }) {
        const payload = {
            name: String(name || '').trim(),
            email: String(email || '').trim().toLowerCase(),
            department: String(department || '').trim(),
            year: String(year || '').trim(),
            timestamp: Date.now()
        };

        if (!payload.name || !/^\S+@\S+\.\S+$/.test(payload.email)) {
            return { success: false, message: 'Valid name and email are required.' };
        }

        localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(payload));
        return { success: true, student: payload };
    },

    isLoggedIn() {
        const data = safeParse(localStorage.getItem(STUDENT_SESSION_KEY));
        return !!(data?.name && data?.email);
    },

    getStudent() {
        return safeParse(localStorage.getItem(STUDENT_SESSION_KEY));
    },

    updateProfile(updates = {}) {
        const current = this.getStudent() || {};
        const merged = {
            ...current,
            ...updates,
            name: String(updates.name ?? current.name ?? '').trim(),
            email: String(updates.email ?? current.email ?? '').trim().toLowerCase(),
            department: String(updates.department ?? current.department ?? '').trim(),
            year: String(updates.year ?? current.year ?? '').trim(),
            timestamp: Date.now()
        };

        if (!merged.name || !/^\S+@\S+\.\S+$/.test(merged.email)) {
            return { success: false, message: 'Valid name and email are required.' };
        }

        localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(merged));
        return { success: true, student: merged };
    },

    logout() {
        localStorage.removeItem(STUDENT_SESSION_KEY);
    }
};
