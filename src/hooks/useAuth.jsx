import { useState, useEffect, createContext, useContext } from 'react'

// Auth context
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    let unsubscribe = () => {}

    const initAuth = async () => {
      try {
        const { auth } = await import('../firebase.js')
        if (!auth) {
          setLoading(false)
          return
        }
        const { onAuthStateChanged } = await import('firebase/auth')
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
      } catch (e) {
        console.warn('Auth init failed — Firebase not configured')
        setLoading(false)
      }
    }

    initAuth()
    return () => unsubscribe()
  }, [])

  const signInGoogle = async () => {
  setAuthError(null)
  try {
    const { signInWithGoogle } = await import('../firebase.jsx')
    if (!signInWithGoogle) throw new Error('Firebase not configured — add VITE_FIREBASE_API_KEY to .env')
    const result = await signInWithGoogle()
    return result.user
  } catch (e) {
    // Silently ignore unconfigured Firebase — just don't sign in
    if (e.message?.includes('YOUR_API_KEY') || e.message?.includes('not configured') || e.code === 'auth/invalid-api-key') {
      setAuthError('Sign-in not available — Firebase not configured')
      return null
    }
    const msg = e.code === 'auth/popup-closed-by-user'
      ? 'Sign-in cancelled'
      : e.message || 'Sign-in failed'
    setAuthError(msg)
    throw e
  }
}

  const signOut = async () => {
    try {
      const { signOutUser } = await import('../firebase.jsx')
      await signOutUser()
      setUser(null)
    } catch (e) {
      console.error('Sign out error:', e)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default useAuth
