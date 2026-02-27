import { api } from '../services/api.js';

export const RegistrationsPage = {
    async render() {
        return `
            <div class="page registrations-page">
                <div class="container">
                    <header class="page-header">
                        <h1>Event Registrations</h1>
                        <p>Participant list from backend records.</p>
                    </header>
                    <div id="registrations-container">
                        <div class="loading-spinner">Loading registrations...</div>
                    </div>
                </div>
            </div>
        `;
    },

    async afterRender(eventId) {
        const container = document.getElementById('registrations-container');

        try {
            const events = await api.getEvents();
            const event = events.find((e) => e.id === eventId || e._id === eventId);

            if (!event) {
                container.innerHTML = '<p class="error-message">Event not found.</p>';
                return;
            }

            const registrations = await api.getRegistrations(eventId);

            if (!Array.isArray(registrations) || registrations.length === 0) {
                container.innerHTML = `
                    <div class="registrations-card">
                        <h2>${this.escapeHtml(event.title)}</h2>
                        <p class="no-events">No registrations yet.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="registrations-card">
                    <h2>${this.escapeHtml(event.title)}</h2>
                    <table class="registrations-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${registrations.map((r) => `
                                <tr>
                                    <td>${this.escapeHtml(r.name || '')}</td>
                                    <td>${this.escapeHtml(r.email || '')}</td>
                                    <td>${new Date(r.createdAt).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (err) {
            console.error(err);
            container.innerHTML = '<p class="error-message">Failed to load registrations.</p>';
        }
    },

    escapeHtml(text = '') {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
