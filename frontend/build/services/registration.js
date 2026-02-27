/**
 * Registration Service
 * Handles event registration logic and storage
 */

// In-memory storage for demo (would be API calls in production)
let registrations = [];

export const registrationService = {
    /**
     * Register a user for an event
     * @param {string} eventId - Event ID
     * @param {string} eventTitle - Event title
     * @param {string} userName - User name (prompted on registration)
     * @returns {Promise<Object>} Registration object
     */
    async registerForEvent(eventId, eventTitle, userName) {
        try {
            // In production, this would be: POST /api/events/${eventId}/register
            const registration = {
                id: Date.now().toString(),
                eventId,
                eventTitle,
                userName,
                registeredAt: new Date().toISOString(),
                status: 'confirmed'
            };
            
            // Store in memory (simulates database)
            registrations.push(registration);
            
            // Also try to save to localStorage for persistence across page reloads
            this.saveToLocalStorage();
            
            return registration;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    /**
     * Get all registrations for a specific event
     * @param {string} eventId - Event ID
     * @returns {Promise<Array>} Array of registrations
     */
    async getEventRegistrations(eventId) {
        try {
            // In production: GET /api/events/${eventId}/registrations
            this.loadFromLocalStorage();
            return registrations.filter(r => r.eventId === eventId);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
            return [];
        }
    },

    /**
     * Get all registrations (for admin view)
     * @returns {Promise<Array>} All registrations
     */
    async getAllRegistrations() {
        try {
            // In production: GET /api/registrations
            this.loadFromLocalStorage();
            return registrations;
        } catch (error) {
            console.error('Failed to fetch all registrations:', error);
            return [];
        }
    },

    /**
     * Save registrations to localStorage for persistence
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },

    /**
     * Load registrations from localStorage
     */
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('eventRegistrations');
            if (saved) {
                registrations = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    },

    /**
     * Check if user is already registered for an event
     * @param {string} eventId - Event ID
     * @param {string} userName - User name
     * @returns {boolean} True if already registered
     */
    isAlreadyRegistered(eventId, userName) {
        return registrations.some(r => 
            r.eventId === eventId && r.userName.toLowerCase() === userName.toLowerCase()
        );
    }
};