import { RegistrationModal } from './RegistrationModal.js';

export const EventCard = {
    render(event) {
        const eventId = event.id || event._id;

        return `
            <article class="event-card">
                <h3 class="event-title">${this.escapeHtml(event.title)}</h3>
                <p class="event-description">${this.escapeHtml(event.description || 'No description provided.')}</p>
                <div class="event-meta">
                    <span class="event-date">${new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div class="event-card-footer">
                    <button class="register-btn" data-id="${eventId}">Register Now</button>
                </div>
            </article>
        `;
    },

    attachHandlers(events = []) {
        const lookup = new Map(events.map((event) => [String(event.id || event._id), event]));

        document.querySelectorAll('.register-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const eventId = String(btn.dataset.id || '');
                const selectedEvent = lookup.get(eventId);
                if (!selectedEvent) return;

                RegistrationModal.open(selectedEvent);
            });
        });
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
