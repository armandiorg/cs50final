#!/bin/bash

# Harvard Poops - Setup Script

echo "🎉 Setting up Harvard Poops..."

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install Flask==3.0.0 Flask-CORS==4.0.0 gunicorn==21.2.0

# Initialize database
echo "🗄️ Initializing database..."
python3 << EOF
import sqlite3
DATABASE = 'harvardpoops.db'
conn = sqlite3.connect(DATABASE)
with open('schema.sql', 'r') as f:
    conn.executescript(f.read())
conn.commit()
conn.close()
print('✅ Database created with seed data!')
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server:"
echo "   python3 app.py"
echo ""
echo "📱 Then visit http://localhost:5000"
echo ""
echo "🔐 Admin password: harvardpoops2024"
