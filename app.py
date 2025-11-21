from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Database setup
DATABASE = 'harvardpoops.db'

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# Public API endpoints
@app.route('/api/events', methods=['GET'])
def get_events():
    db = get_db()
    events = db.execute('''
        SELECT * FROM events
        WHERE status = 'published'
        ORDER BY event_datetime DESC
    ''').fetchall()
    return jsonify([dict(row) for row in events])

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    db = get_db()
    event = db.execute('SELECT * FROM events WHERE id = ?', (event_id,)).fetchone()
    if event:
        return jsonify(dict(event))
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/events/upcoming', methods=['GET'])
def get_upcoming_events():
    db = get_db()
    now = datetime.now().isoformat()
    events = db.execute('''
        SELECT * FROM events
        WHERE status = 'published' AND event_datetime >= ?
        ORDER BY event_datetime ASC
    ''', (now,)).fetchall()
    return jsonify([dict(row) for row in events])

# Voting endpoints
@app.route('/api/voting/<int:session_id>', methods=['GET'])
def get_voting_session(session_id):
    db = get_db()
    session = db.execute('SELECT * FROM voting_sessions WHERE id = ?', (session_id,)).fetchone()
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    options = db.execute('''
        SELECT * FROM voting_options
        WHERE session_id = ?
        ORDER BY option_order
    ''', (session_id,)).fetchall()

    total_votes = sum(opt['vote_count'] for opt in options)

    return jsonify({
        'session': dict(session),
        'options': [dict(opt) for opt in options],
        'total_votes': total_votes
    })

@app.route('/api/votes', methods=['POST'])
def submit_vote():
    data = request.json
    session_id = data.get('session_id')
    option_id = data.get('option_id')

    if not session_id or not option_id:
        return jsonify({'error': 'Missing parameters'}), 400

    db = get_db()

    # Check if session is active
    session = db.execute('SELECT * FROM voting_sessions WHERE id = ? AND is_active = 1', (session_id,)).fetchone()
    if not session:
        return jsonify({'error': 'Voting is closed'}), 403

    # Increment vote count
    db.execute('UPDATE voting_options SET vote_count = vote_count + 1 WHERE id = ?', (option_id,))
    db.commit()

    # Get updated results
    options = db.execute('SELECT * FROM voting_options WHERE session_id = ?', (session_id,)).fetchall()
    return jsonify({
        'success': True,
        'options': [dict(opt) for opt in options]
    })

# Admin endpoints (simple password check)
ADMIN_PASSWORD = 'harvardpoops2024'  # Hackathon only!

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    if data.get('password') == ADMIN_PASSWORD:
        return jsonify({'success': True, 'token': 'admin-token'})
    return jsonify({'error': 'Invalid password'}), 401

@app.route('/api/admin/events', methods=['GET'])
def get_admin_events():
    # Simple auth check
    if request.headers.get('Authorization') != 'Bearer admin-token':
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    events = db.execute('SELECT * FROM events ORDER BY event_datetime DESC').fetchall()
    return jsonify([dict(row) for row in events])

@app.route('/api/admin/events', methods=['POST'])
def create_event():
    if request.headers.get('Authorization') != 'Bearer admin-token':
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO events (title, description, event_datetime, location, event_type, track, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['title'],
        data.get('description', ''),
        data['event_datetime'],
        data.get('location', ''),
        data.get('event_type', 'party'),
        data.get('track', 'official'),
        data.get('status', 'published')
    ))
    db.commit()
    return jsonify({'id': cursor.lastrowid, 'success': True}), 201

@app.route('/api/admin/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    if request.headers.get('Authorization') != 'Bearer admin-token':
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.json
    db = get_db()
    db.execute('''
        UPDATE events
        SET title = ?, description = ?, event_datetime = ?, location = ?, event_type = ?, track = ?, status = ?
        WHERE id = ?
    ''', (
        data['title'],
        data.get('description', ''),
        data['event_datetime'],
        data.get('location', ''),
        data.get('event_type', 'party'),
        data.get('track', 'official'),
        data.get('status', 'published'),
        event_id
    ))
    db.commit()
    return jsonify({'success': True})

@app.route('/api/admin/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    if request.headers.get('Authorization') != 'Bearer admin-token':
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    db.execute('DELETE FROM events WHERE id = ?', (event_id,))
    db.commit()
    return jsonify({'success': True})

# Serve frontend
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/event/<int:event_id>')
def event_page(event_id):
    return send_from_directory('static', 'event.html')

@app.route('/admin')
def admin_page():
    return send_from_directory('static', 'admin.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
