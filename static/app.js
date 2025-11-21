// Harvard Poops - Main App JavaScript

const API_BASE = window.location.origin;

// AUTH CHECK - Protect this page
document.addEventListener('DOMContentLoaded', () => {
    // Check for auth token
    const token = localStorage.getItem('userToken');
    if (!token) {
        // No token, redirect to landing page
        window.location.href = '/';
        return;
    }

    // Token exists, load events
    loadEvents('all');
    setupFilters();
});

// Logout function
function logout() {
    if (confirm('logout?')) {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }
}

// Load events from API
async function loadEvents(filter = 'all') {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = '<div class="loading">Loading events...</div>';

    try {
        let url = `${API_BASE}/api/events`;
        if (filter === 'upcoming') {
            url = `${API_BASE}/api/events/upcoming`;
        }

        const response = await fetch(url);
        let events = await response.json();

        // Apply filter
        if (filter === 'official') {
            events = events.filter(e => e.track === 'official');
        } else if (filter === 'partner') {
            events = events.filter(e => e.track === 'partner');
        }

        if (events.length === 0) {
            grid.innerHTML = '<div class="loading">No events found</div>';
            return;
        }

        grid.innerHTML = events.map(event => createEventCard(event)).join('');

        // Add smooth fade-in animation with stagger
        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100); // Stagger by 100ms

            // Add click handler to the button specifically
            const detailsBtn = card.querySelector('.btn-view-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const eventId = card.dataset.eventId;
                    window.location.href = `/event/${eventId}`;
                });
            }

            // Also allow clicking the whole card
            card.addEventListener('click', () => {
                const eventId = card.dataset.eventId;
                window.location.href = `/event/${eventId}`;
            });
        });
    } catch (error) {
        console.error('Error loading events:', error);
        grid.innerHTML = '<div class="loading">Error loading events</div>';
    }
}

// Event type configurations
const EVENT_TYPE_CONFIG = {
    party: { emoji: '🎉', color: '#A51C30' },
    contest: { emoji: '🏆', color: '#EC4899' },
    tailgate: { emoji: '🏈', color: '#06B6D4' },
    mixer: { emoji: '🍹', color: '#10B981' },
    other: { emoji: '⭐', color: '#6B7280' }
};

// Create event card HTML
function createEventCard(event) {
    const eventType = event.event_type || 'other';
    const track = event.track || 'official';
    const config = EVENT_TYPE_CONFIG[eventType] || EVENT_TYPE_CONFIG.other;

    // Format date and time
    const date = new Date(event.event_datetime);
    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    // Determine header gradient color
    const gradientColor = track === 'official' ? '#A51C30' : '#06B6D4';

    // Track badge label and class
    const trackLabel = track === 'official' ? 'OFFICIAL HP' : 'PARTNER EVENT';

    // Truncate description
    const description = event.description ? truncate(event.description, 120) : '';

    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-header" style="background: linear-gradient(135deg, ${gradientColor} 0%, #1E1E1E 100%)"></div>
            <div class="event-badges">
                <span class="event-type-badge">${config.emoji} ${eventType}</span>
                <span class="track-badge ${track}">${trackLabel}</span>
            </div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-meta">
                <div class="meta-item">📅 ${dateStr} at ${timeStr}</div>
                ${event.location ? `<div class="meta-item">📍 ${event.location}</div>` : ''}
            </div>
            ${description ? `<p class="event-description">${description}</p>` : ''}
            <button class="btn-view-details">View Details →</button>
        </div>
    `;
}

// Setup filter buttons
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Load filtered events
            const filter = btn.dataset.filter;
            loadEvents(filter);
        });
    });
}

// Utility: Truncate text
function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}
