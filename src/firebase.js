import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Vite exposes env vars via import.meta.env
// Provide these in a `.env` file (see `.env.example`).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

function hasAllFirebaseConfig(cfg) {
  // measurementId is optional; allow missing.
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'databaseURL',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ]
  return requiredKeys.every((k) => Boolean(cfg[k]))
}

export const firebaseApp = hasAllFirebaseConfig(firebaseConfig)
  ? initializeApp(firebaseConfig)
  : null

export const db = firebaseApp ? getDatabase(firebaseApp) : null


