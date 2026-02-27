import { api } from '../services/api.js';

export const AdminPage = {
    async render() {
        return `
            <div class="page admin-page">
                <div class="container">
                    <header class="page-header">
                        <h1>Admin Dashboard</h1>
                        <p>Create events and monitor registration volume.</p>
                    </header>

                    <section class="admin-dashboard">
                        <article class="admin-card">
                            <div class="card-header">
                                <h2>Create Event</h2>
                            </div>
                            <form id="create-event-form" class="event-form">
                                <div class="form-group">
                                    <label for="event-title">Title</label>
                                    <input type="text" id="event-title" name="title" required />
                                </div>
                                <div class="form-group">
                                    <label for="event-date">Date</label>
                                    <input type="date" id="event-date" name="date" required />
                                </div>
                                <div class="form-group">
                                    <label for="event-description">Description</label>
                                    <textarea id="event-description" name="description" rows="4" required></textarea>
                                </div>
                                <button type="submit" class="submit-btn">Create Event</button>
                            </form>
                            <div id="form-message" class="form-message"></div>
                        </article>

                        <article class="admin-card">
                            <div class="card-header card-header-between">
                                <h2>Events</h2>
                                <span class="badge badge-primary" id="events-total-badge">0</span>
                            </div>
                            <div id="events-list-container" class="events-list-container">
                                <div class="loading-spinner">Loading events...</div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        `;
    },

    async afterRender() {
        await this.loadEventsList();

        const form = document.getElementById('create-event-form');
        const messageDiv = document.getElementById('form-message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const eventData = {
                title: String(formData.get('title') || '').trim(),
                date: formData.get('date'),
                description: String(formData.get('description') || '').trim()
            };

            if (!eventData.title || !eventData.date || !eventData.description) {
                this.showMessage(messageDiv, 'All fields are required.', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';

            try {
                await api.createEvent(eventData);
                form.reset();
                this.showMessage(messageDiv, 'Event created successfully.', 'success');
                await this.loadEventsList();
            } catch (error) {
                this.showMessage(messageDiv, error.message || 'Failed to create event.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Event';
            }
        });
    },

    async loadEventsList() {
        const container = document.getElementById('events-list-container');
        const badge = document.getElementById('events-total-badge');

        try {
            const events = await api.getEvents();
            badge.textContent = String(events.length);

            if (events.length === 0) {
                container.innerHTML = '<div class="empty-state">No events created yet.</div>';
                return;
            }

            container.innerHTML = events
                .map((event) => {
                    const eventId = event.id || event._id;
                    return `
                        <div class="event-list-item">
                            <div>
                                <h3 class="event-list-title">${this.escapeHtml(event.title)}</h3>
                                <p class="event-description">${this.escapeHtml(event.description || '')}</p>
                                <p class="event-meta">${new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <a href="#registrations/${eventId}" class="btn-secondary view-registrations-link" data-event-id="${eventId}">
                                View Registrations
                            </a>
                        </div>
                    `;
                })
                .join('');
        } catch (error) {
            container.innerHTML = '<div class="error-message">Failed to load events.</div>';
        }
    },

    showMessage(element, text, type) {
        element.textContent = text;
        element.className = `form-message ${type}`;
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
