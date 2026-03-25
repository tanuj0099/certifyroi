// Simplified firebase.js — delegates everything to firebase.jsx
// This file exists only for backwards compatibility
export { auth, db, default } from './firebase.jsx'
export { signInWithGoogle, signOutUser } from './firebase.jsx'