import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          employees (
            id,
            employee_id,
            department:departments(name),
            position:positions(title),
            salary,
            status
          )
        `)?.eq('id', userId)?.single()
      
      if (error && error?.code !== 'PGRST116') {
        setError(error?.message)
        return
      }
      
      setUserProfile(data)
    } catch (err) {
      if (err?.message?.includes('Failed to fetch')) {
        setError('Cannot connect to database. Your Supabase project may be paused or inactive. Please check your Supabase dashboard.')
        return
      }
      setError('Failed to load user profile')
    }
  }

  const signIn = async (email, password) => {
    setError(null)
    setLoading(true)
    
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(error?.message)
        return { user: null, error }
      }
      
      return { user: data?.user, error: null };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { user: null, error: err }
      }
      setError('Something went wrong. Please try again.')
      return { user: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    setError(null)
    setLoading(true)
    
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata?.full_name || email?.split('@')?.[0] || 'User',
            role: metadata?.role || 'employee'
          }
        }
      })
      
      if (error) {
        setError(error?.message)
        return { user: null, error }
      }
      
      return { user: data?.user, error: null };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.')
        return { user: null, error: err }
      }
      setError('Something went wrong. Please try again.')
      return { user: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setError(null)
    
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) {
        setError(error?.message)
        return
      }
      
      setUser(null)
      setUserProfile(null)
    } catch (err) {
      setError('Failed to sign out')
    }
  }

  const updateProfile = async (updates) => {
    if (!user?.id) return { error: new Error('No user logged in') }
    
    setError(null)
    
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      
      if (error) {
        setError(error?.message)
        return { data: null, error }
      }
      
      setUserProfile(prev => ({ ...prev, ...data }))
      return { data, error: null }
    } catch (err) {
      setError('Failed to update profile')
      return { data: null, error: err }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin: userProfile?.role === 'admin',
    isHR: ['admin', 'hr_manager']?.includes(userProfile?.role),
    isDepartmentHead: userProfile?.role === 'department_head',
    employee: userProfile?.employees?.[0] || null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider