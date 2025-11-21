# 🎉 Harvard Poops

**Your go-to social calendar for what's happening at Harvard**

A web application for managing and discovering events at Harvard, built in one night for a hackathon!

## 🚀 Features

- **Public Event Feed**: Browse upcoming parties, tailgates, contests, and more
- **Event Details**: Full event information with date, time, location, and description
- **Admin Panel**: Create, edit, and delete events without touching code
- **Live Voting**: Real-time voting on events (like "Best Costume Contest")
- **Mobile-Friendly**: Responsive design works great on phones

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite
- **Deployment**: Railway

## 📦 Quick Start

### Prerequisites
- Python 3.11+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/cs50final.git
cd cs50final
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the app:
```bash
python app.py
```

4. Open your browser to `http://localhost:5000`

## 🎨 Project Structure

```
cs50final/
├── app.py              # Flask backend
├── schema.sql          # Database schema + seed data
├── requirements.txt    # Python dependencies
├── Procfile           # Railway deployment config
├── static/
│   ├── index.html     # Homepage
│   ├── event.html     # Event detail page
│   ├── admin.html     # Admin panel
│   ├── styles.css     # All styles
│   ├── app.js         # Homepage JavaScript
│   ├── event.js       # Event page JavaScript
│   └── admin.js       # Admin panel JavaScript
└── README.md
```

## 🔐 Admin Access

**Password**: `harvardpoops2024`

Go to `/admin` and use the password to create/edit events.

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/events` - Get all published events
- `GET /api/events/:id` - Get single event
- `GET /api/events/upcoming` - Get upcoming events only
- `GET /api/voting/:sessionId` - Get voting session
- `POST /api/votes` - Submit a vote

### Admin Endpoints (requires auth)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/events` - Get all events (including drafts)
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event

## 🚢 Deployment

### Railway (Recommended)

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Railway auto-detects Flask and deploys!
5. Your app will be live at `https://your-app.up.railway.app`

### Manual Deployment

1. Ensure `Procfile` and `requirements.txt` are present
2. Push to your hosting platform
3. Set environment variable `PORT` if needed
4. Run database initialization on first deploy

## 📝 Database Schema

Three main tables:

- **events**: All event data (title, description, datetime, location, type, track)
- **voting_sessions**: Voting sessions linked to events
- **voting_options**: Vote options with vote counts

Schema includes seed data with 5 sample events!

## 🎨 Design Features

- **Harvard Crimson** color scheme (#A51C30)
- Mobile-first responsive design
- Card-based event layout
- Real-time voting with visual results
- Clean admin interface

## 🔮 Future Enhancements

- Partner event submission form
- QR code generation for events
- Real WebSocket voting (currently polls every 3s)
- Image uploads for events
- User authentication (multiple admins)
- Email notifications
- Advanced filtering and search
- Event categories and tags

## 👥 Team

Built by Armand Iorgulescu for CS50 Final Project

## 📄 License

MIT License - feel free to use this for your own events platform!

## 🙏 Acknowledgments

- CS50 for the amazing course
- Harvard Poops for the inspiration
- Flask and Python community

---

**🚀 Ready to party? Visit [harvardpoops.com](https://harvardpoops.com) (coming soon!)**
