// Harvard Poops - Admin Panel JavaScript

const API_BASE = window.location.origin;
let authToken = localStorage.getItem('adminToken');
let allEvents = []; // Store events for stats calculation

// Check if logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showAdminSection();
        loadAdminEvents();
    }

    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Create event button
    document.getElementById('create-event-btn').addEventListener('click', showEventForm);

    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', hideEventForm);

    // Event form
    document.getElementById('event-form').addEventListener('submit', handleEventSubmit);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add to body
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show confirmation dialog
function showConfirmDialog(message) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-content">
                <h3>Confirm Action</h3>
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="btn-secondary confirm-cancel">Cancel</button>
                    <button class="btn-danger confirm-ok">Delete</button>
                </div>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Trigger animation
        setTimeout(() => overlay.classList.add('show'), 10);

        // Handle buttons
        const cleanup = (result) => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            resolve(result);
        };

        dialog.querySelector('.confirm-cancel').addEventListener('click', () => cleanup(false));
        dialog.querySelector('.confirm-ok').addEventListener('click', () => cleanup(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup(false);
        });
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        'published': '<span class="status-badge status-published">Published</span>',
        'draft': '<span class="status-badge status-draft">Draft</span>',
        'archived': '<span class="status-badge status-archived">Archived</span>'
    };
    return badges[status] || badges['draft'];
}

// Update stats cards
function updateStats(events) {
    allEvents = events;

    const total = events.length;
    const published = events.filter(e => e.status === 'published').length;
    const upcoming = events.filter(e => {
        const eventDate = new Date(e.event_datetime);
        const now = new Date();
        return eventDate > now && e.status === 'published';
    }).length;

    // Update DOM
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-published').textContent = published;
    document.getElementById('stat-upcoming').textContent = upcoming;
}

// ==========================================
// AUTHENTICATION
// ==========================================

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('admin-password').value;
    const loginBtn = e.target.querySelector('button[type="submit"]');
    const originalText = loginBtn.textContent;

    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showToast('Login successful!', 'success');
            showAdminSection();
            loadAdminEvents();
        } else {
            showToast('Invalid password', 'error');
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
}

// Handle logout
function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');

    // Fade out admin section
    const adminSection = document.getElementById('admin-section');
    const loginSection = document.getElementById('login-section');
    const logoutBtn = document.getElementById('logout-btn');

    adminSection.style.opacity = '0';

    setTimeout(() => {
        adminSection.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginSection.style.display = 'block';

        // Reset form
        document.getElementById('admin-password').value = '';

        // Fade in login section
        setTimeout(() => {
            loginSection.style.opacity = '1';
        }, 10);
    }, 300);

    showToast('Logged out successfully', 'success');
}

// Show admin section
function showAdminSection() {
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const logoutBtn = document.getElementById('logout-btn');

    // Fade out login section
    loginSection.style.opacity = '0';

    setTimeout(() => {
        loginSection.style.display = 'none';
        adminSection.style.display = 'block';
        logoutBtn.style.display = 'block';

        // Fade in admin section
        setTimeout(() => {
            adminSection.style.opacity = '1';
        }, 10);
    }, 300);
}

// ==========================================
// EVENT MANAGEMENT
// ==========================================

// Load admin events
async function loadAdminEvents() {
    const tbody = document.getElementById('admin-events-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                <div class="loading-spinner"></div>
                Loading events...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE}/api/admin/events`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const events = await response.json();

        // Update stats
        updateStats(events);

        // Sort events by date (newest first)
        events.sort((a, b) => new Date(b.event_datetime) - new Date(a.event_datetime));

        if (events.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <p>No events yet</p>
                        <button class="btn-primary" onclick="showEventForm()">Create Your First Event</button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = events.map(event => {
            const eventDate = new Date(event.event_datetime);
            const now = new Date();
            const isPast = eventDate < now;
            const dateStr = formatDate(event.event_datetime);

            return `
                <tr class="event-row ${isPast ? 'past-event' : ''}">
                    <td>
                        <strong>${event.title}</strong>
                        ${isPast ? '<span class="past-label">Past</span>' : ''}
                    </td>
                    <td>${dateStr}</td>
                    <td><span class="event-type-badge">${event.event_type}</span></td>
                    <td><span class="track-badge track-${event.track}">${event.track}</span></td>
                    <td>${getStatusBadge(event.status)}</td>
                    <td class="actions">
                        <button class="btn-icon btn-edit" onclick="editEvent(${event.id})" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon btn-danger" onclick="deleteEvent(${event.id})" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="error-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>Error loading events</p>
                    <button class="btn-secondary" onclick="loadAdminEvents()">Try Again</button>
                </td>
            </tr>
        `;
        showToast('Failed to load events', 'error');
    }
}

// Show event form
function showEventForm() {
    const formSection = document.getElementById('event-form-section');
    const listSection = document.getElementById('events-list-section');

    // Fade out list section
    listSection.style.opacity = '0';

    setTimeout(() => {
        listSection.style.display = 'none';
        formSection.style.display = 'block';

        // Reset form
        document.getElementById('form-title').textContent = 'Create Event';
        document.getElementById('event-form').reset();
        document.getElementById('event-id').value = '';

        // Set default values
        document.getElementById('status').value = 'published';
        document.getElementById('track').value = 'official';

        // Fade in form section
        setTimeout(() => {
            formSection.style.opacity = '1';
            // Focus on first input
            document.getElementById('title').focus();
        }, 10);
    }, 300);
}

// Hide event form
function hideEventForm() {
    const formSection = document.getElementById('event-form-section');
    const listSection = document.getElementById('events-list-section');

    // Fade out form section
    formSection.style.opacity = '0';

    setTimeout(() => {
        formSection.style.display = 'none';
        listSection.style.display = 'block';

        // Fade in list section
        setTimeout(() => {
            listSection.style.opacity = '1';
        }, 10);
    }, 300);
}

// Edit event
async function editEvent(eventId) {
    const formSection = document.getElementById('event-form-section');
    const listSection = document.getElementById('events-list-section');

    try {
        // Show loading state
        showToast('Loading event...', 'info');

        const response = await fetch(`${API_BASE}/api/events/${eventId}`);
        const event = await response.json();

        // Populate form
        document.getElementById('event-id').value = event.id;
        document.getElementById('title').value = event.title;
        document.getElementById('description').value = event.description || '';
        document.getElementById('event-datetime').value = event.event_datetime.replace(' ', 'T').substring(0, 16);
        document.getElementById('location').value = event.location || '';
        document.getElementById('event-type').value = event.event_type;
        document.getElementById('track').value = event.track;
        document.getElementById('status').value = event.status || 'published';

        // Populate optional fields if they exist
        if (document.getElementById('rsvp-link')) {
            document.getElementById('rsvp-link').value = event.rsvp_link || '';
        }
        if (document.getElementById('playlist-link')) {
            document.getElementById('playlist-link').value = event.playlist_link || '';
        }

        document.getElementById('form-title').textContent = 'Edit Event';

        // Fade transition
        listSection.style.opacity = '0';
        setTimeout(() => {
            listSection.style.display = 'none';
            formSection.style.display = 'block';
            setTimeout(() => {
                formSection.style.opacity = '1';
                document.getElementById('title').focus();
            }, 10);
        }, 300);
    } catch (error) {
        console.error('Error loading event:', error);
        showToast('Error loading event', 'error');
    }
}

// Delete event
async function deleteEvent(eventId) {
    const confirmed = await showConfirmDialog('Are you sure you want to delete this event? This action cannot be undone.');

    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE}/api/admin/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (data.success) {
            showToast('Event deleted successfully', 'success');
            loadAdminEvents();
        } else {
            showToast('Failed to delete event', 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Error deleting event', 'error');
    }
}

// Handle event form submit
async function handleEventSubmit(e) {
    e.preventDefault();

    // Clear previous validation errors
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));

    // Get form values
    const eventId = document.getElementById('event-id').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const eventDatetime = document.getElementById('event-datetime').value;
    const location = document.getElementById('location').value.trim();
    const eventType = document.getElementById('event-type').value;
    const track = document.getElementById('track').value;
    const status = document.getElementById('status').value;

    // Validation
    let hasError = false;

    if (!title || title.length < 3) {
        showFieldError('title', 'Title must be at least 3 characters');
        hasError = true;
    }

    if (!eventDatetime) {
        showFieldError('event-datetime', 'Event date and time is required');
        hasError = true;
    }

    if (!location) {
        showFieldError('location', 'Location is required');
        hasError = true;
    }

    if (hasError) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }

    // Build event data
    const eventData = {
        title,
        description,
        event_datetime: eventDatetime.replace('T', ' ') + ':00',
        location,
        event_type: eventType,
        track,
        status
    };

    // Add optional fields
    const rsvpLink = document.getElementById('rsvp-link');
    const playlistLink = document.getElementById('playlist-link');

    if (rsvpLink && rsvpLink.value.trim()) {
        eventData.rsvp_link = rsvpLink.value.trim();
    }
    if (playlistLink && playlistLink.value.trim()) {
        eventData.playlist_link = playlistLink.value.trim();
    }

    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = eventId ? 'Updating...' : 'Creating...';
    submitBtn.disabled = true;

    try {
        const method = eventId ? 'PUT' : 'POST';
        const url = eventId
            ? `${API_BASE}/api/admin/events/${eventId}`
            : `${API_BASE}/api/admin/events`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (data.success || data.id) {
            showToast(
                eventId ? 'Event updated successfully!' : 'Event created successfully!',
                'success'
            );
            hideEventForm();
            loadAdminEvents();
        } else {
            showToast(data.error || 'Failed to save event', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error saving event:', error);
        showToast('Error saving event. Please try again.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show field validation error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error-input');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}
