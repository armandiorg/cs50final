// Harvard Poops - Event Detail Page

const API_BASE = window.location.origin;

// Get event ID from URL
const eventId = window.location.pathname.split('/')[2];

// Load event on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEvent();
});

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

// Render event detail HTML
function renderEventDetail(event) {
    const date = new Date(event.event_datetime);
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    const badgeClass = `badge-${event.event_type}`;

    return `
        <div class="event-detail">
            <span class="event-badge ${badgeClass}">${event.event_type}</span>
            <h1>${event.title}</h1>

            <div class="event-meta">
                <div class="meta-item">
                    <strong>📅 Date:</strong> ${dateStr}
                </div>
                <div class="meta-item">
                    <strong>🕐 Time:</strong> ${timeStr}
                </div>
                ${event.location ? `
                <div class="meta-item">
                    <strong>📍 Location:</strong> ${event.location}
                </div>
                ` : ''}
                <div class="meta-item">
                    <strong>🏷️ Track:</strong> ${event.track === 'official' ? 'HP Official' : 'Partner Event'}
                </div>
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
            <div class="vote-option" onclick="submitVote(${sessionId}, ${option.id})">
                <div class="vote-result-bar" style="width: ${percentage}%"></div>
                <span class="vote-option-text">${option.option_text}</span>
                <span class="vote-percentage">${percentage}%</span>
                <span style="color: #666; font-size: 14px;">(${option.vote_count} votes)</span>
            </div>
        `;
    }).join('');
}

// Submit vote
async function submitVote(sessionId, optionId) {
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

        if (data.success) {
            alert('Vote submitted! Results are updating...');
            refreshVoting(sessionId);
        } else {
            alert(data.error || 'Failed to submit vote');
        }
    } catch (error) {
        console.error('Error submitting vote:', error);
        alert('Error submitting vote');
    }
}

// Refresh voting results
async function refreshVoting(sessionId) {
    try {
        const response = await fetch(`${API_BASE}/api/voting/${sessionId}`);
        const data = await response.json();

        document.getElementById('total-votes').textContent = data.total_votes;
        renderVotingOptions(data.options, sessionId, data.total_votes);
    } catch (error) {
        console.error('Error refreshing voting:', error);
    }
}
