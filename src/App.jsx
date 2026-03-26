import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { onValue, ref } from 'firebase/database'
import { Navbar } from './components/Navbar.jsx'
import { SensorCard } from './components/SensorCard.jsx'
import { StatusBanner } from './components/StatusBanner.jsx'
import { db } from './firebase.js'

function toNumberOrNull(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function toBooleanOrNull(value) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true
  if (value === false || value === 'false' || value === 0 || value === '0') return false
  return null
}

export default function App() {
  const [temperature, setTemperature] = useState(null)
  const [tds, setTds] = useState(null)
  const [ph, setPh] = useState(null)
  const [safe, setSafe] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!db) return

    const sensorsRef = ref(db, 'water')

    const unsub = onValue(
      sensorsRef,
      (snapshot) => {
        const v = snapshot.val() || {}

        // Map keys from Firebase: temperature, tds, ph, safe
        setTemperature(toNumberOrNull(v.temperature))
        setTds(toNumberOrNull(v.tds))
        setPh(toNumberOrNull(v.ph))
        setSafe(toBooleanOrNull(v.safe))

        setIsLive(true)
        setIsLoading(false)
      },
      (error) => {
        console.error('Firebase listener error:', error)
        setIsLive(false)
        setIsLoading(false)
      },
    )

    return () => unsub()
  }, [])

  const isDataReady =
    !isLoading &&
    temperature !== null &&
    tds !== null &&
    ph !== null &&
    safe !== null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar isLive={isLive} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {!isDataReady ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/25 p-10 text-center backdrop-blur-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-slate-950/60 ring-1 ring-slate-800/70">
                <div className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-sm font-medium tracking-wide text-slate-200 animate-pulse">
                Waiting for Bottle Data...
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <StatusBanner safe={safe} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SensorCard kind="ph" label="pH Level" value={ph} unit="" precision={2} />
              <SensorCard kind="temp" label="Temperature" value={temperature} unit="°C" precision={1} />
              <SensorCard kind="tds" label="TDS" value={tds} unit="ppm" precision={0} />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}