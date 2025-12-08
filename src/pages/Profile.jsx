import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { eventService } from '../services/eventService'
import { rsvpService } from '../services/rsvpService'

export default function Profile() {
  const { user, profile, signOut, generateReferralCode, refreshProfile } = useAuth()
  const [referralCodes, setReferralCodes] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [myRSVPs, setMyRSVPs] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('info') // 'info', 'events', 'rsvps', 'referrals'
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone_number: '',
    house: '',
  })
  const [editLoading, setEditLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      // Fetch all data in parallel for faster loading
      Promise.all([
        fetchReferralCodes(),
        fetchMyEvents(),
        fetchMyRSVPs()
      ]).then(() => {
        setDataLoaded(true)
      })
    }
  }, [user])

  const fetchReferralCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReferralCodes(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching referral codes:', err)
      return []
    }
  }

  const fetchMyEvents = async () => {
    try {
      const events = await eventService.getUserEvents(user.id)
      setMyEvents(events)
      return events
    } catch (err) {
      console.error('Error fetching my events:', err)
      return []
    }
  }

  const fetchMyRSVPs = async () => {
    try {
      const rsvps = await rsvpService.getUserRSVPsWithEvents(user.id)
      setMyRSVPs(rsvps)
      return rsvps
    } catch (err) {
      console.error('Error fetching my RSVPs:', err)
      return []
    }
  }

  const handleGenerateCode = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    const { code, error: genError } = await generateReferralCode()

    if (genError) {
      setError(genError)
    } else {
      setSuccess(`New code generated: ${code}`)
      await fetchReferralCodes()
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setSuccess(`Copied ${code} to clipboard!`)
    setTimeout(() => setSuccess(''), 2000)
  }

  const openEditModal = () => {
    setEditForm({
      full_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      house: profile?.house || '',
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name.trim(),
          phone_number: editForm.phone_number.trim(),
          house: editForm.house,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Refresh the profile in AuthContext
      if (refreshProfile) {
        await refreshProfile()
      }

      setShowEditModal(false)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`)
    } finally {
      setEditLoading(false)
    }
  }

  // Freshman dorms
  const FRESHMAN_DORMS = [
    'Apley Court',
    'Grays',
    'Greenough',
    'Hollis',
    'Holworthy',
    'Hurlbut',
    'Lionel',
    'Matthews',
    'Mower',
    'Pennypacker',
    'Straus',
    'Thayer',
    'Weld',
    'Wigglesworth',
    'Other'
  ]

  // Upperclass houses
  const UPPERCLASS_HOUSES = [
    'Adams',
    'Cabot',
    'Currier',
    'Dudley',
    'Dunster',
    'Eliot',
    'Kirkland',
    'Leverett',
    'Lowell',
    'Mather',
    'Pforzheimer',
    'Quincy',
    'Winthrop',
    'Off-Campus',
    'Other'
  ]

  // Get houses based on user's year
  const getAvailableHouses = () => {
    if (profile?.year === 'Freshman') {
      return FRESHMAN_DORMS
    }
    return UPPERCLASS_HOUSES
  }

  // Format date: "Dec 15"
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Format time: "9:00 PM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const displayHour = hour % 12 || 12
    const period = hour >= 12 ? 'PM' : 'AM'
    return `${displayHour}:${minutes} ${period}`
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black-true)' }}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button
            onClick={() => navigate('/')}
            className="btn-text"
          >
            ← Back
          </button>
          <h1 className="header-title">
            Profile
          </h1>
          <button
            onClick={handleSignOut}
            className="btn-text"
            style={{ color: 'var(--color-crimson-bright)' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-gray-800)',
        background: 'var(--color-black-elevated)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {[
          { id: 'info', label: 'Info' },
          { id: 'rsvps', label: 'RSVPs' },
          { id: 'events', label: 'My Events' },
          { id: 'referrals', label: 'Invite' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: '1',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              color: activeTab === tab.id ? 'var(--color-crimson-bright)' : 'var(--color-gray-400)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-crimson-bright)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Profile Info Tab */}
        {activeTab === 'info' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="h3" style={{ margin: 0 }}>Your Information</h2>
              <button
                onClick={openEditModal}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Edit
              </button>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{profile.full_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Year</span>
                <span className="info-value">{profile.year}</span>
              </div>
              <div className="info-row">
                <span className="info-label">House</span>
                <span className="info-value">{profile.house}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{profile.phone_number}</span>
              </div>
            </div>
          </div>
        )}

        {/* My RSVPs Tab */}
        {activeTab === 'rsvps' && (
          <div>
            <h2 className="h3 mb-4">Events You're Attending</h2>
            {myRSVPs.length === 0 ? (
              <div className="card text-center">
                <p className="text-secondary mb-4">You haven't RSVPed to any events yet</p>
                <Link to="/" className="btn btn-primary">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myRSVPs.map(rsvp => (
                  <Link 
                    key={rsvp.id} 
                    to={`/event/${rsvp.events.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card" style={{ 
                      display: 'flex', 
                      gap: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}>
                      {/* Event Image */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--color-bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {rsvp.events.cover_image_url ? (
                          <img 
                            src={rsvp.events.cover_image_url} 
                            alt={rsvp.events.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '24px' }}>
                            {rsvp.events.type === 'party' ? '🎉' : 
                             rsvp.events.type === 'contest' ? '🏆' :
                             rsvp.events.type === 'tailgate' ? '🏈' :
                             rsvp.events.type === 'mixer' ? '🍹' : '⭐'}
                          </span>
                        )}
                      </div>
                      {/* Event Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: '600',
                          color: 'var(--color-gray-100)',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {rsvp.events.title}
                        </h3>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'var(--color-gray-400)',
                          marginBottom: '2px',
                        }}>
                          {formatDate(rsvp.events.date)} • {formatTime(rsvp.events.time)}
                        </p>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'var(--color-gray-500)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {rsvp.events.location}
                        </p>
                      </div>
                      {/* Arrow */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'var(--color-gray-500)',
                      }}>
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Events Tab */}
        {activeTab === 'events' && (
          <div>
            <h2 className="h3 mb-4">Events You're Hosting</h2>
            {myEvents.length === 0 ? (
              <div className="card text-center">
                <p className="text-secondary mb-4">You haven't created any events yet</p>
                <Link to="/" className="btn btn-primary">
                  Create an Event
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myEvents.map(event => (
                  <Link 
                    key={event.id} 
                    to={`/event/${event.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card" style={{ 
                      display: 'flex', 
                      gap: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                    }}>
                      {/* Event Image */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--color-bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {event.cover_image_url ? (
                          <img 
                            src={event.cover_image_url} 
                            alt={event.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '24px' }}>
                            {event.type === 'party' ? '🎉' : 
                             event.type === 'contest' ? '🏆' :
                             event.type === 'tailgate' ? '🏈' :
                             event.type === 'mixer' ? '🍹' : '⭐'}
                          </span>
                        )}
                      </div>
                      {/* Event Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600',
                            color: 'var(--color-gray-100)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.2',
                            margin: 0,
                          }}>
                            {event.title}
                          </h3>
                          <span className={`badge ${event.status === 'published' ? 'badge-success' : ''}`} style={{ fontSize: '10px', flexShrink: 0 }}>
                            {event.status.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'var(--color-gray-400)',
                          marginBottom: '2px',
                        }}>
                          {formatDate(event.date)} • {formatTime(event.time)}
                        </p>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'var(--color-gray-500)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {event.location}
                        </p>
                      </div>
                      {/* Arrow */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'var(--color-gray-500)',
                      }}>
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="card">
            <h2 className="h3 mb-2">Invite Friends</h2>
            <p className="text-sm text-secondary mb-4">
              You can generate {profile.referral_codes_remaining} more referral code
              {profile.referral_codes_remaining !== 1 ? 's' : ''}
            </p>

            {error && (
              <div className="error-banner">
                <p className="error-text">{error}</p>
              </div>
            )}

            {success && (
              <div className="success-banner">
                <p className="success-text">{success}</p>
              </div>
            )}

            <button
              onClick={handleGenerateCode}
              disabled={loading || profile.referral_codes_remaining <= 0}
              className="btn btn-primary w-full mb-6"
            >
              {loading ? 'Generating...' : 'Generate Referral Code'}
            </button>

            {referralCodes.length > 0 && (
              <div>
                <h3 className="text-sm text-secondary mb-3">Your Codes</h3>
                <div className="grid gap-2">
                  {referralCodes.map((code) => (
                    <div key={code.id} className="code-card">
                      <div className="code-details">
                        <p className="code-value">{code.code}</p>
                        <p className={`code-status ${code.is_used ? 'code-status-used' : 'code-status-available'}`}>
                          {code.is_used ? (
                            <>Used on {new Date(code.used_at).toLocaleDateString()}</>
                          ) : (
                            <>Available</>
                          )}
                        </p>
                      </div>
                      {!code.is_used && (
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="btn btn-tertiary ml-4"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ padding: 'var(--space-6)' }}>
              <h2 className="h2" style={{ marginBottom: 'var(--space-4)' }}>Edit Profile</h2>
              
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                    className="input"
                    placeholder="(xxx) xxx-xxxx"
                  />
                </div>

                {/* House */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label">House/Dorm</label>
                  <select
                    value={editForm.house}
                    onChange={(e) => setEditForm({ ...editForm, house: e.target.value })}
                    className="input"
                    required
                    style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px', paddingRight: '40px' }}
                  >
                    <option value="">Select your {profile?.year === 'Freshman' ? 'dorm' : 'house'}</option>
                    {getAvailableHouses().map(house => (
                      <option key={house} value={house}>{house}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p style={{ color: 'var(--color-crimson-bright)', fontSize: '14px' }}>{error}</p>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={editLoading}
                  >
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
