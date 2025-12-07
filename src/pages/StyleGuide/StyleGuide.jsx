import React from 'react';
import './StyleGuide.css';

/**
 * STYLE GUIDE SHOWCASE
 * Interactive demo of the Refined Premium design system
 *
 * This page demonstrates:
 * - Typography hierarchy (Playfair Display + Inter)
 * - Color palette (Deep blacks, Harvard crimson, metallic accents)
 * - Component library (Buttons, cards, inputs, badges, etc.)
 * - Animation patterns
 * - Spacing system
 */

export default function StyleGuide() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [progressValue, setProgressValue] = React.useState(65);

  return (
    <div className="style-guide">
      {/* Hero Section */}
      <section className="sg-hero">
        <div className="container">
          <div className="sg-hero-content animate-slide-up">
            <h1 className="text-gradient-crimson">
              Harvard Poops
            </h1>
            <p className="sg-hero-subtitle">
              Refined Premium Design System
            </p>
            <p className="description" style={{ maxWidth: '600px', margin: '0 auto' }}>
              A dark, mysterious aesthetic that combines Harvard's storied crimson tradition
              with contemporary editorial elegance. Built for mobile-first experiences with
              exceptional attention to typography, spacing, and subtle animations.
            </p>
            <div className="flex gap-4 items-center justify-center mt-8">
              <button className="btn btn-primary">
                Explore Events
              </button>
              <button className="btn btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-20">
        {/* Color Palette Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Color Palette</h2>
          <p className="text-secondary mb-8">
            Deep blacks, Harvard crimson, and metallic accents create a luxurious dark theme
          </p>

          <div className="sg-subsection">
            <h3 className="h3">Primary Colors</h3>
            <div className="sg-color-grid">
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#000000' }}></div>
                <div className="sg-color-info">
                  <span className="label">Black True</span>
                  <span className="text-sm text-muted">#000000</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#0A0A0A' }}></div>
                <div className="sg-color-info">
                  <span className="label">Black Rich</span>
                  <span className="text-sm text-muted">#0A0A0A</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#141414' }}></div>
                <div className="sg-color-info">
                  <span className="label">Black Soft</span>
                  <span className="text-sm text-muted">#141414</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#1A1A1A' }}></div>
                <div className="sg-color-info">
                  <span className="label">Black Elevated</span>
                  <span className="text-sm text-muted">#1A1A1A</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sg-subsection">
            <h3 className="h3">Harvard Crimson</h3>
            <div className="sg-color-grid">
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#8B0A1F' }}></div>
                <div className="sg-color-info">
                  <span className="label">Crimson Deep</span>
                  <span className="text-sm text-muted">#8B0A1F</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#A41034' }}></div>
                <div className="sg-color-info">
                  <span className="label">Crimson Primary</span>
                  <span className="text-sm text-muted">#A41034</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#C41E3A' }}></div>
                <div className="sg-color-info">
                  <span className="label">Crimson Bright</span>
                  <span className="text-sm text-muted">#C41E3A</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sg-subsection">
            <h3 className="h3">Metallic Accents</h3>
            <div className="sg-color-grid">
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#D4AF37' }}></div>
                <div className="sg-color-info">
                  <span className="label">Gold Champagne</span>
                  <span className="text-sm text-muted">#D4AF37</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#C0C0C0' }}></div>
                <div className="sg-color-info">
                  <span className="label">Silver Light</span>
                  <span className="text-sm text-muted">#C0C0C0</span>
                </div>
              </div>
              <div className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: '#8C7853' }}></div>
                <div className="sg-color-info">
                  <span className="label">Bronze</span>
                  <span className="text-sm text-muted">#8C7853</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Typography Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Typography</h2>
          <p className="text-secondary mb-8">
            Editorial elegance with Playfair Display for headings and Inter for body text
          </p>

          <div className="sg-subsection">
            <h3 className="h3">Font Families</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h4 className="h4" style={{ fontFamily: 'Playfair Display' }}>
                  Playfair Display
                </h4>
                <p className="text-sm text-muted mb-4">Display & Headings</p>
                <p style={{ fontFamily: 'Playfair Display', fontSize: '24px', lineHeight: '1.3' }}>
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-sm text-tertiary mt-2">
                  Weights: 400, 500, 600, 700, 800, 900
                </p>
              </div>
              <div className="card p-6">
                <h4 className="h4" style={{ fontFamily: 'Inter' }}>
                  Inter
                </h4>
                <p className="text-sm text-muted mb-4">Body Text & UI</p>
                <p style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '1.6' }}>
                  The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
                </p>
                <p className="text-sm text-tertiary mt-2">
                  Weights: 300, 400, 500, 600, 700
                </p>
              </div>
            </div>
          </div>

          <div className="sg-subsection">
            <h3 className="h3">Type Scale</h3>
            <div className="card p-8">
              <h1 className="h1 mb-6">Heading 1 - Display Large</h1>
              <h2 className="h2 mb-6">Heading 2 - Page Title</h2>
              <h3 className="h3 mb-6">Heading 3 - Section Heading</h3>
              <h4 className="h4 mb-6">Heading 4 - Subsection</h4>
              <p className="text-xl mb-4">Text XL - Emphasized body text for important content</p>
              <p className="text-base mb-4">Text Base (16px) - Default body text with comfortable reading line height</p>
              <p className="text-sm">Text SM (14px) - Secondary information and metadata</p>
            </div>
          </div>

          <div className="sg-subsection">
            <h3 className="h3">Special Typography</h3>
            <div className="card p-8">
              <div className="pull-quote mb-8">
                "An investment in knowledge pays the best interest."
              </div>
              <div className="metadata mb-4">
                Friday, Dec 6, 2025
                <span className="metadata-separator"></span>
                Harvard Yard
                <span className="metadata-separator"></span>
                8:00 PM
              </div>
              <p className="description">
                This is description text with relaxed line-height for long-form content.
                It's optimized for readability on dark backgrounds with comfortable spacing
                between lines and generous margins.
              </p>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Buttons Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Buttons</h2>
          <p className="text-secondary mb-8">
            Clear hierarchy with crimson gradient primary, outlined secondary, and ghost tertiary
          </p>

          <div className="sg-subsection">
            <h3 className="h3">Button Variants</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center flex-wrap">
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-secondary">Secondary Button</button>
                <button className="btn btn-tertiary">Tertiary Button</button>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <button className="btn btn-primary btn-sm">Small</button>
                <button className="btn btn-primary">Regular</button>
                <button className="btn btn-primary btn-lg">Large</button>
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <button className="btn btn-primary" disabled>Disabled Primary</button>
                <button className="btn btn-secondary" disabled>Disabled Secondary</button>
              </div>
              <div className="flex gap-4 items-center">
                <button className="btn btn-primary btn-icon" aria-label="Heart">❤️</button>
                <button className="btn btn-secondary btn-icon" aria-label="Star">⭐</button>
                <button className="btn btn-tertiary btn-icon" aria-label="Share">📤</button>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Cards Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Cards</h2>
          <p className="text-secondary mb-8">
            Elevated surfaces with subtle crimson glow and smooth hover interactions
          </p>

          <div className="grid md:grid-cols-2 gap-6 stagger-children">
            <div className="card hover-lift">
              <h3 className="h3 mb-3">Standard Card</h3>
              <p className="description mb-4">
                Cards use subtle borders, soft shadows, and a crimson glow effect on hover.
                The elevation creates depth and hierarchy.
              </p>
              <div className="flex gap-3">
                <button className="btn btn-primary btn-sm">Action</button>
                <button className="btn btn-tertiary btn-sm">Cancel</button>
              </div>
            </div>

            <div className="card card-premium hover-lift">
              <h3 className="h3 mb-3">Premium Card</h3>
              <p className="description mb-4">
                Premium cards feature a gold badge and special border treatment.
                Perfect for highlighting exclusive events or VIP content.
              </p>
              <div className="flex gap-2">
                <span className="badge badge-gold">EXCLUSIVE</span>
                <span className="badge badge-crimson">FEATURED</span>
              </div>
            </div>

            <div className="event-card">
              <div className="event-card-image">
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #8B0A1F 0%, #A41034 50%, #C41E3A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  🎉
                </div>
              </div>
              <div className="event-card-content">
                <div className="flex gap-2 mb-3">
                  <span className="badge badge-live">LIVE</span>
                  <span className="badge badge-crimson">PARTY</span>
                </div>
                <h3 className="event-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
                  Final Club Mixer
                </h3>
                <div className="metadata mb-4">
                  Tonight
                  <span className="metadata-separator"></span>
                  9:00 PM
                  <span className="metadata-separator"></span>
                  The Fly Club
                </div>
                <p className="description mb-4">
                  An exclusive evening with Harvard's finest. Dress code: formal attire required.
                </p>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  RSVP Now
                </button>
              </div>
            </div>

            <div className="event-card">
              <div className="event-card-image">
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #1A3A5F 0%, #2D5F3F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  🎵
                </div>
              </div>
              <div className="event-card-content">
                <div className="flex gap-2 mb-3">
                  <span className="badge badge-gold">PREMIUM</span>
                  <span className="badge badge-gray">MUSIC</span>
                </div>
                <h3 className="event-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
                  Jazz Night at Sanders
                </h3>
                <div className="metadata mb-4">
                  Dec 15
                  <span className="metadata-separator"></span>
                  8:00 PM
                  <span className="metadata-separator"></span>
                  Sanders Theatre
                </div>
                <p className="description mb-4">
                  Experience an intimate evening of jazz with renowned performers in the historic Sanders Theatre.
                </p>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Forms & Inputs Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Forms & Inputs</h2>
          <p className="text-secondary mb-8">
            Refined input fields with focus states and elegant validation
          </p>

          <div className="card p-8 max-w-2xl mx-auto">
            <h3 className="h3 mb-6">Event RSVP Form</h3>

            <div className="form-group">
              <label className="label label-required">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label className="label label-required">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@harvard.edu"
              />
            </div>

            <div className="form-group">
              <label className="label">Dietary Restrictions</label>
              <select className="input select">
                <option>None</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Gluten-Free</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Additional Comments</label>
              <textarea
                className="input textarea"
                placeholder="Any special requests or questions?"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="checkbox" />
                <span className="text-base text-secondary">
                  I agree to receive event updates and notifications
                </span>
              </label>
            </div>

            <div className="form-group">
              <label className="label">Will you attend?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="attendance" className="radio" />
                  <span className="text-base">Yes, I'll be there</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="attendance" className="radio" />
                  <span className="text-base">Maybe</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="attendance" className="radio" />
                  <span className="text-base">Can't make it</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="btn btn-primary" style={{ flex: 1 }}>
                Submit RSVP
              </button>
              <button className="btn btn-tertiary">
                Cancel
              </button>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Badges & Tags Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Badges & Tags</h2>
          <p className="text-secondary mb-8">
            Category labels and status indicators
          </p>

          <div className="card p-8">
            <h3 className="h3 mb-4">Badge Variants</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="badge badge-crimson">FEATURED</span>
              <span className="badge badge-gold">PREMIUM</span>
              <span className="badge badge-gray">DRAFT</span>
              <span className="badge badge-success">CONFIRMED</span>
              <span className="badge badge-live">LIVE NOW</span>
            </div>

            <h3 className="h3 mb-4">Event Categories</h3>
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-crimson">🎉 PARTY</span>
              <span className="badge badge-gold">🎵 MUSIC</span>
              <span className="badge badge-gray">📚 ACADEMIC</span>
              <span className="badge badge-crimson">🏆 COMPETITION</span>
              <span className="badge badge-gold">🎭 ARTS</span>
              <span className="badge badge-gray">⚽ SPORTS</span>
              <span className="badge badge-success">🍽️ FOOD</span>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Interactive Components Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Interactive Components</h2>
          <p className="text-secondary mb-8">
            Progress bars, avatars, and dynamic elements
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="h3 mb-4">Progress Bar</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Event Capacity</span>
                  <span className="text-crimson">{progressValue}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-tertiary btn-sm"
                  onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                >
                  -10%
                </button>
                <button
                  className="btn btn-tertiary btn-sm"
                  onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                >
                  +10%
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="h3 mb-4">Avatars</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar avatar-sm">AS</div>
                <div className="avatar">JD</div>
                <div className="avatar avatar-lg">MK</div>
              </div>
              <p className="text-sm text-tertiary">
                Small (32px), Regular (40px), Large (56px)
              </p>
            </div>

            <div className="card p-6">
              <h3 className="h3 mb-4">Loading States</h3>
              <div className="flex items-center gap-6">
                <div className="spinner spinner-sm"></div>
                <div className="spinner"></div>
                <div className="spinner spinner-lg"></div>
              </div>
              <div className="mt-6">
                <div className="dots-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="h3 mb-4">Modal Example</h3>
              <button
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                Open Modal
              </button>
              <p className="text-sm text-tertiary mt-3">
                Click to see the modal overlay transition
              </p>
            </div>
          </div>
        </section>

        <div className="divider-crimson"></div>

        {/* Spacing System Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Spacing System</h2>
          <p className="text-secondary mb-8">
            8px base unit for consistent rhythm and alignment
          </p>

          <div className="card p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div style={{ width: '4px', height: '32px', background: 'var(--color-crimson-bright)' }}></div>
                <span className="text-sm font-medium">4px - space-1</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: '8px', height: '32px', background: 'var(--color-crimson-bright)' }}></div>
                <span className="text-sm font-medium">8px - space-2</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: '16px', height: '32px', background: 'var(--color-crimson-bright)' }}></div>
                <span className="text-sm font-medium">16px - space-4</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: '24px', height: '32px', background: 'var(--color-crimson-bright)' }}></div>
                <span className="text-sm font-medium">24px - space-6</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: '32px', height: '32px', background: 'var(--color-crimson-bright)' }}></div>
                <span className="text-sm font-medium">32px - space-8</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: '48px', height: '32px', background: 'var(--color-crimson-bright)' }}></div>
                <span className="text-sm font-medium">48px - space-12</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Example Modal</h2>
              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="description mb-4">
                This modal demonstrates the refined overlay transition with backdrop blur
                and smooth scale animation.
              </p>
              <p className="text-sm text-tertiary">
                Notice the elegant ease-in timing and the subtle crimson glow on the card shadow.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-primary" style={{ flex: 1 }}>
                Confirm
              </button>
              <button
                className="btn btn-tertiary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Example */}
      <nav className="bottom-nav">
        <a href="#" className="bottom-nav-item active">
          <div className="bottom-nav-icon">🏠</div>
          <span>Home</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <div className="bottom-nav-icon">🔍</div>
          <span>Explore</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <div className="bottom-nav-icon">➕</div>
          <span>Create</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <div className="bottom-nav-icon">👤</div>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
}
