// Harvard Poops - Event Detail Page

const API_BASE = window.location.origin;

// Get event ID from URL
const eventId = window.location.pathname.split('/')[2];

// AUTH CHECK - Protect this page
document.addEventListener('DOMContentLoaded', () => {
    // Check for auth token
    const token = localStorage.getItem('userToken');
    if (!token) {
        // No token, redirect to landing page
        window.location.href = '/';
        return;
    }

    // Token exists, load event
    loadEvent();
});

// Logout function
function logout() {
    if (confirm('logout?')) {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }
}

// Load event details
async function loadEvent() {
    const detailDiv = document.getElementById('event-detail');

    try {
        const response = await fetch(`${API_BASE}/api/events/${eventId}`);
        const event = await response.json();

        if (event.error) {
            detailDiv.innerHTML = '<div class="loading">Event not found</div>';
            return;
        }

        detailDiv.innerHTML = renderEventDetail(event);

        // Check for voting session
        checkVotingSession(eventId);
    } catch (error) {
        console.error('Error loading event:', error);
        detailDiv.innerHTML = '<div class="loading">Error loading event</div>';
    }
}

// Format event date as "Friday, Nov 22 • 10:00 PM"
function formatEventDate(datetime) {
    const date = new Date(datetime);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${dayName}, ${monthDay} • ${time}`;
}

// Render event detail HTML
function renderEventDetail(event) {
    const formattedDate = formatEventDate(event.event_datetime);
    const badgeClass = `badge-${event.event_type}`;
    const trackBadgeClass = event.track === 'official' ? 'badge-official' : 'badge-partner';

    // Set hero gradient based on track
    const heroGradient = event.track === 'official'
        ? 'linear-gradient(135deg, #A51C30 0%, #7A1523 100%)'
        : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)';

    return `
        <div class="event-detail">
            <div class="event-hero" style="background: ${heroGradient}">
                <div class="event-badges">
                    <span class="event-badge ${badgeClass}">${event.event_type}</span>
                    <span class="event-badge ${trackBadgeClass}">
                        ${event.track === 'official' ? 'HP Official' : 'Partner Event'}
                    </span>
                </div>
                <h1 class="event-title">${event.title}</h1>
                <div class="event-datetime">${formattedDate}</div>
            </div>

            <div class="event-info-cards">
                ${event.location ? `
                <div class="info-card">
                    <div class="info-icon">📍</div>
                    <div class="info-content">
                        <div class="info-label">Location</div>
                        <div class="info-value">${event.location}</div>
                    </div>
                </div>
                ` : ''}

                ${event.dress_code ? `
                <div class="info-card">
                    <div class="info-icon">👔</div>
                    <div class="info-content">
                        <div class="info-label">Dress Code</div>
                        <div class="info-value">${event.dress_code}</div>
                    </div>
                </div>
                ` : ''}

                ${event.what_to_bring ? `
                <div class="info-card">
                    <div class="info-icon">🎒</div>
                    <div class="info-content">
                        <div class="info-label">What to Bring</div>
                        <div class="info-value">${event.what_to_bring}</div>
                    </div>
                </div>
                ` : ''}
            </div>

            ${event.description ? `
            <div class="description">
                <h2>About This Event</h2>
                <p>${event.description}</p>
            </div>
            ` : ''}
        </div>
    `;
}

// Check for voting session
async function checkVotingSession(eventId) {
    try {
        // For demo, we'll check if this is event 3 (Halloween)
        if (eventId == 3) {
            loadVotingSession(1); // Session ID 1
        }
    } catch (error) {
        console.error('Error checking voting:', error);
    }
}

// Load voting session
async function loadVotingSession(sessionId) {
    try {
        const response = await fetch(`${API_BASE}/api/voting/${sessionId}`);
        const data = await response.json();

        if (data.error) return;

        const votingSection = document.getElementById('voting-section');
        votingSection.style.display = 'block';

        document.getElementById('voting-question').textContent = data.session.question;
        document.getElementById('total-votes').textContent = data.total_votes;

        renderVotingOptions(data.options, sessionId, data.total_votes);

        // Poll for updates every 3 seconds
        setInterval(() => refreshVoting(sessionId), 3000);
    } catch (error) {
        console.error('Error loading voting:', error);
    }
}

// Render voting options
function renderVotingOptions(options, sessionId, totalVotes) {
    const optionsDiv = document.getElementById('voting-options');

    optionsDiv.innerHTML = options.map(option => {
        const percentage = totalVotes > 0
            ? Math.round((option.vote_count / totalVotes) * 100)
            : 0;

        return `
            <div class="vote-option" data-option-id="${option.id}" onclick="submitVote(${sessionId}, ${option.id})">
                <div class="option-content">
                    <span class="option-text">${option.option_text}</span>
                    <span class="vote-stats">${percentage}% • ${option.vote_count} votes</span>
                </div>
                <div class="vote-bar">
                    <div class="vote-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Submit vote with enhanced feedback
async function submitVote(sessionId, optionId) {
    const optionElement = document.querySelector(`.vote-option[data-option-id="${optionId}"]`);

    // Add loading state
    optionElement.classList.add('voting');

    // Add haptic feedback for mobile
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }

    try {
        const response = await fetch(`${API_BASE}/api/votes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                option_id: optionId
            })
        });

        const data = await response.json();

        // Remove loading state
        optionElement.classList.remove('voting');

        if (data.success) {
            // Show success toast
            showToast('Vote recorded! ✓', 'success');

            // Add success animation
            optionElement.classList.add('voted');

            // Refresh voting results
            await refreshVoting(sessionId);

            // Remove voted class after animation
            setTimeout(() => optionElement.classList.remove('voted'), 1000);
        } else {
            showToast(data.error || 'Failed to submit vote', 'error');
        }
    } catch (error) {
        console.error('Error submitting vote:', error);
        optionElement.classList.remove('voting');
        showToast('Error submitting vote', 'error');
    }
}

// Refresh voting results with smooth animations
async function refreshVoting(sessionId) {
    try {
        const response = await fetch(`${API_BASE}/api/voting/${sessionId}`);
        const data = await response.json();

        // Update total votes with pulse animation if changed
        const totalVotesElement = document.getElementById('total-votes');
        const oldTotal = parseInt(totalVotesElement.textContent) || 0;
        const newTotal = data.total_votes;

        if (newTotal !== oldTotal) {
            totalVotesElement.classList.add('pulse');
            setTimeout(() => totalVotesElement.classList.remove('pulse'), 500);
        }
        totalVotesElement.textContent = newTotal;

        // Store old percentages for animation
        const oldOptions = {};
        document.querySelectorAll('.vote-option').forEach(option => {
            const optionId = option.getAttribute('data-option-id');
            const fillElement = option.querySelector('.vote-fill');
            if (fillElement) {
                const width = fillElement.style.width;
                oldOptions[optionId] = parseFloat(width) || 0;
            }
        });

        // Re-render options
        renderVotingOptions(data.options, sessionId, data.total_votes);

        // Animate any changes
        document.querySelectorAll('.vote-option').forEach(option => {
            const optionId = option.getAttribute('data-option-id');
            const fillElement = option.querySelector('.vote-fill');
            const newWidth = parseFloat(fillElement.style.width) || 0;
            const oldWidth = oldOptions[optionId] || 0;

            // Add pulse if percentage changed
            if (newWidth !== oldWidth) {
                fillElement.classList.add('updating');
                setTimeout(() => fillElement.classList.remove('updating'), 500);
            }
        });
    } catch (error) {
        console.error('Error refreshing voting:', error);
    }
}
