import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile, signOut, generateReferralCode } = useAuth()
  const [referralCodes, setReferralCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchReferralCodes()
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
    } catch (err) {
      console.error('Error fetching referral codes:', err)
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
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Profile Info */}
        <div className="card mb-6">
          <h2 className="h3 mb-4">
            Your Information
          </h2>
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

        {/* Referral Codes */}
        <div className="card">
          <h2 className="h3 mb-2">
            Invite Friends
          </h2>
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
              <h3 className="text-sm text-secondary mb-3">
                Your Codes
              </h3>
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
      </main>
    </div>
  )
}
