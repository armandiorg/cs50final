import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with proper async/await to prevent race conditions
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (err) {
        console.error('Auth initialization failed:', err)
      } finally {
        // ALWAYS set loading to false, even if errors occur
        setLoading(false)
      }
    }
    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error.message)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, fullName, year, house, phoneNumber, referralCode }) => {
    try {
      // Validate Harvard email
      const emailDomain = email.toLowerCase().split('@')[1]
      if (emailDomain !== 'harvard.edu' && emailDomain !== 'college.harvard.edu') {
        throw new Error('Please use a Harvard email address (@harvard.edu or @college.harvard.edu)')
      }

      // Validate referral code
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', referralCode.toUpperCase())
        .single()

      if (codeError || !codeData) {
        throw new Error('Invalid referral code')
      }

      if (codeData.is_used) {
        throw new Error('This referral code has already been used')
      }

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        year,
        house,
        email,
        phone_number: phoneNumber,
        referred_by_code: referralCode.toUpperCase(),
      })

      if (profileError) throw profileError

      // Mark referral code as used
      const { error: updateCodeError } = await supabase
        .from('referral_codes')
        .update({
          is_used: true,
          used_by: authData.user.id,
          used_at: new Date().toISOString(),
        })
        .eq('code', referralCode.toUpperCase())

      if (updateCodeError) throw updateCodeError

      return { user: authData.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Update last login
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.user.id)
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const generateReferralCode = async () => {
    try {
      if (!user || !profile) {
        throw new Error('Must be logged in to generate referral codes')
      }

      if (profile.referral_codes_remaining <= 0) {
        throw new Error('You have no referral codes remaining')
      }

      // Generate unique code
      const code = `HP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      // Insert code
      const { data, error } = await supabase.from('referral_codes').insert({
        code,
        created_by: user.id,
      }).select().single()

      if (error) throw error

      // Update user's remaining codes
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          referral_codes_generated: profile.referral_codes_generated + 1,
          referral_codes_remaining: profile.referral_codes_remaining - 1,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Refresh profile
      await fetchProfile(user.id)

      return { code: data.code, error: null }
    } catch (error) {
      return { code: null, error: error.message }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    generateReferralCode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
