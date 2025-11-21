// Harvard Poops - Main App JavaScript

const API_BASE = window.location.origin;

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEvents('all');
    setupFilters();
});

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

        // Add click handlers
        document.querySelectorAll('.event-card').forEach(card => {
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

// Create event card HTML
function createEventCard(event) {
    const badgeClass = `badge-${event.event_type}`;
    const date = new Date(event.event_datetime);
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-card-content">
                <span class="event-badge ${badgeClass}">${event.event_type}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-datetime">
                    📅 ${dateStr} at ${timeStr}
                </div>
                ${event.location ? `
                <div class="event-location">
                    📍 ${event.location}
                </div>
                ` : ''}
                ${event.description ? `
                <p class="event-description">${truncate(event.description, 100)}</p>
                ` : ''}
            </div>
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
