import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
const HOUSES = [
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
  'Other'
]

export default function Signup() {
  const [step, setStep] = useState(1) // 1 = referral code, 2 = account details
  const [referralCode, setReferralCode] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    year: '',
    house: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const validateReferralCode = async () => {
    setError('')
    setLoading(true)

    try {
      const { data, error: codeError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', referralCode.toUpperCase())
        .single()

      if (codeError || !data) {
        setError('Invalid referral code. Please check and try again.')
        setLoading(false)
        return
      }

      if (data.is_used) {
        setError('This referral code has already been used.')
        setLoading(false)
        return
      }

      // Code is valid, proceed to step 2
      setStep(2)
      setLoading(false)
    } catch (err) {
      setError('Error validating referral code. Please try again.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    const emailDomain = formData.email.toLowerCase().split('@')[1]
    if (emailDomain !== 'harvard.edu' && emailDomain !== 'college.harvard.edu') {
      setError('Please use a Harvard email address (@harvard.edu or @college.harvard.edu)')
      return
    }

    setLoading(true)

    const { user, error: signUpError } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      year: formData.year,
      house: formData.house,
      phoneNumber: formData.phoneNumber,
      referralCode: referralCode.toUpperCase(),
    })

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
    } else if (user) {
      navigate('/')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Step 1: Referral Code Entry
  if (step === 1) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="h1 text-gradient-crimson">Harvard Poops</h1>
            <h2 className="h2">Join the community</h2>
            <p className="text-sm text-secondary">Enter your referral code to get started</p>
          </div>

          {error && (
            <div className="error-banner">
              <p className="error-text">{error}</p>
            </div>
          )}

          <div>
            <div className="form-group">
              <label htmlFor="referralCode" className="label label-required">
                Referral Code
              </label>
              <input
                id="referralCode"
                name="referralCode"
                type="text"
                required
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="input"
                placeholder="HP-LAUNCH2025"
                maxLength={20}
                style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
              />
              <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
                Ask a friend for a referral code to sign up
              </p>
            </div>

            <button
              onClick={validateReferralCode}
              disabled={loading || !referralCode}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? 'Validating...' : 'Continue'}
            </button>
          </div>

          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          <p className="text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Step 2: Account Details
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="h1 text-gradient-crimson">Harvard Poops</h1>
          <h2 className="h2">Create your account</h2>
          <p className="text-sm text-secondary">Tell us a bit about yourself</p>
        </div>

        {error && (
          <div className="error-banner">
            <p className="error-text">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="input"
              placeholder="John Harvard"
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label htmlFor="year" className="label">
                Year
              </label>
              <select
                id="year"
                name="year"
                required
                value={formData.year}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">Select</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="house" className="label">
                House
              </label>
              <select
                id="house"
                name="house"
                required
                value={formData.house}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">Select</option>
                {HOUSES.map((house) => (
                  <option key={house} value={house}>
                    {house}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="label">
              Harvard Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="you@harvard.edu"
            />
            <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
              Must be @harvard.edu or @college.harvard.edu
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="label label-required">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="input"
              placeholder="(617) 555-0100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label label-required">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              placeholder="••••••••"
            />
            <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
              At least 8 characters
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-6"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setStep(1)}
            className="btn-text auth-link"
          >
            ← Use a different referral code
          </button>
        </div>
      </div>
    </div>
  )
}
