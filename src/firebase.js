import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Vite exposes env vars via import.meta.env
// Provide these in a `.env` file (see `.env.example`).
const firebaseConfig = {
  apiKey: "AIzaSyBWL2mm7CwncJSpsTQDipBlSyQYxAhf7Sg",
  authDomain: "smart-water-bottle-fb3b7.firebaseapp.com",
  projectId: "smart-water-bottle-fb3b7",
  storageBucket: "smart-water-bottle-fb3b7.firebasestorage.app",
  messagingSenderId: "826867907527",
  appId: "1:826867907527:web:095c532479796990eeb7e2",
  measurementId: "G-ZN0P2WWZ3K"
}

function hasAllFirebaseConfig(cfg) {
  return Object.values(cfg).every(Boolean)
}

export const firebaseApp = hasAllFirebaseConfig(firebaseConfig)
  ? initializeApp(firebaseConfig)
  : null

export const db = firebaseApp ? getDatabase(firebaseApp) : null


