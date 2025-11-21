// Harvard Poops - Admin Panel JavaScript

const API_BASE = window.location.origin;
let authToken = localStorage.getItem('adminToken');

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

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('admin-password').value;

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
            showAdminSection();
            loadAdminEvents();
        } else {
            alert('Invalid password');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

// Handle logout
function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

// Show admin section
function showAdminSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'block';
}

// Load admin events
async function loadAdminEvents() {
    const tbody = document.getElementById('admin-events-tbody');
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading events...</td></tr>';

    try {
        const response = await fetch(`${API_BASE}/api/admin/events`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const events = await response.json();

        if (events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="loading">No events yet</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(event => {
            const date = new Date(event.event_datetime);
            const dateStr = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            return `
                <tr>
                    <td><strong>${event.title}</strong></td>
                    <td>${dateStr}</td>
                    <td>${event.event_type}</td>
                    <td>
                        <button class="btn-edit" onclick="editEvent(${event.id})">Edit</button>
                        <button class="btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="loading">Error loading events</td></tr>';
    }
}

// Show event form
function showEventForm() {
    document.getElementById('event-form-section').style.display = 'block';
    document.getElementById('events-list-section').style.display = 'none';
    document.getElementById('form-title').textContent = 'Create Event';
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
}

// Hide event form
function hideEventForm() {
    document.getElementById('event-form-section').style.display = 'none';
    document.getElementById('events-list-section').style.display = 'block';
}

// Edit event
async function editEvent(eventId) {
    try {
        const response = await fetch(`${API_BASE}/api/events/${eventId}`);
        const event = await response.json();

        document.getElementById('event-id').value = event.id;
        document.getElementById('title').value = event.title;
        document.getElementById('description').value = event.description || '';
        document.getElementById('event-datetime').value = event.event_datetime.replace(' ', 'T');
        document.getElementById('location').value = event.location || '';
        document.getElementById('event-type').value = event.event_type;
        document.getElementById('track').value = event.track;

        document.getElementById('form-title').textContent = 'Edit Event';
        document.getElementById('event-form-section').style.display = 'block';
        document.getElementById('events-list-section').style.display = 'none';
    } catch (error) {
        console.error('Error loading event:', error);
        alert('Error loading event');
    }
}

// Delete event
async function deleteEvent(eventId) {
    if (!confirm('Delete this event?')) return;

    try {
        const response = await fetch(`${API_BASE}/api/admin/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (data.success) {
            alert('Event deleted');
            loadAdminEvents();
        } else {
            alert('Failed to delete event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
    }
}

// Handle event form submit
async function handleEventSubmit(e) {
    e.preventDefault();

    const eventId = document.getElementById('event-id').value;
    const eventData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        event_datetime: document.getElementById('event-datetime').value.replace('T', ' ') + ':00',
        location: document.getElementById('location').value,
        event_type: document.getElementById('event-type').value,
        track: document.getElementById('track').value,
        status: 'published'
    };

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
            alert(eventId ? 'Event updated!' : 'Event created!');
            hideEventForm();
            loadAdminEvents();
        } else {
            alert('Failed to save event');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        alert('Error saving event');
    }
}
