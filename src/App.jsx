import { useEffect, useMemo, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './components/Navbar.jsx'
import { SensorCard } from './components/SensorCard.jsx'
import { StatusBanner } from './components/StatusBanner.jsx'
import { AnalyticsChart } from './components/AnalyticsChart.jsx'
import { db } from './firebase.js'

function toNumberOrNull(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function formatLastUpdated(value) {
  if (!value) return '—'
  const d = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

function computeSafety({ ph, tds }) {
  const hasNumbers = typeof ph === 'number' && typeof tds === 'number'
  if (!hasNumbers) {
    return {
      status: 'UNSAFE',
      message: 'Waiting for valid sensor data…',
    }
  }

  const phOk = ph >= 6.5 && ph <= 8.5
  const tdsOk = tds < 500

  if (phOk && tdsOk) return { status: 'SAFE', message: 'Water looks within safe limits.' }

  if (!phOk && !tdsOk) {
    return {
      status: 'UNSAFE',
      message: `pH out of range (6.5–8.5) and TDS too high (must be < 500).`,
    }
  }
  if (!phOk) {
    return { status: 'UNSAFE', message: 'pH out of range (safe range: 6.5–8.5).' }
  }
  return { status: 'UNSAFE', message: 'TDS too high (safe threshold: < 500).' }
}

export default function App() {
  const [ph, setPh] = useState(null)
  const [tds, setTds] = useState(null)
  const [temp, setTemp] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isLive, setIsLive] = useState(false)

  const [phHistory, setPhHistory] = useState(() => {
    const now = Date.now()
    return Array.from({ length: 24 }).map((_, i) => ({
      t: new Date(now - (23 - i) * 60_000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      ph: Number((7.2 + Math.sin(i / 3) * 0.3 + (Math.random() - 0.5) * 0.3).toFixed(2)),
    }))
  })

  const [tempHistory, setTempHistory] = useState(() => {
    const now = Date.now()
    return Array.from({ length: 24 }).map((_, i) => ({
      t: new Date(now - (23 - i) * 60_000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temp: Number((24 + Math.sin(i / 4) * 1.5 + (Math.random() - 0.5) * 1.2).toFixed(1)),
    }))
  })

  const [tdsHistory, setTdsHistory] = useState(() => {
    const now = Date.now()
    const seed = 240
    return Array.from({ length: 24 }).map((_, i) => ({
      t: new Date(now - (23 - i) * 60_000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      tds: Math.round(seed + Math.sin(i / 2) * 25 + (Math.random() - 0.5) * 18),
    }))
  })

  useEffect(() => {
    if (!db) return

    const sensorsRef = ref(db, 'bottle_01/sensors')
    const unsub = onValue(
      sensorsRef,
      (snapshot) => {
        const v = snapshot.val() || {}
        setPh(toNumberOrNull(v.ph))
        setTds(toNumberOrNull(v.tds))
        setTemp(toNumberOrNull(v.temp))
        setLastUpdated(v.lastUpdated ?? Date.now())
        setIsLive(true)
      },
      () => setIsLive(false),
    )

    return () => unsub()
  }, [])

  // Demo mode: if Firebase isn't configured, keep the UI alive with simulated updates.
  useEffect(() => {
    if (db) return

    setIsLive(false)
    const tick = () => {
      const basePh = 7.2 + (Math.random() - 0.5) * 0.6
      const baseTemp = 22 + (Math.random() - 0.5) * 4
      const nextTds = Math.round(260 + (Math.random() - 0.5) * 120)
      setPh(Number(basePh.toFixed(2)))
      setTemp(Number(baseTemp.toFixed(1)))
      setTds(nextTds)
      setLastUpdated(Date.now())
    }

    tick()
    const id = setInterval(tick, 3500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (typeof ph !== 'number') return
    setPhHistory((prev) => {
      const nowLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      const next = [...prev, { t: nowLabel, ph }]
      return next.slice(-36)
    })
  }, [ph])

  useEffect(() => {
    if (typeof temp !== 'number') return
    setTempHistory((prev) => {
      const nowLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      const next = [...prev, { t: nowLabel, temp }]
      return next.slice(-36)
    })
  }, [temp])

  useEffect(() => {
    if (typeof tds !== 'number') return
    setTdsHistory((prev) => {
      const nowLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      const next = [...prev, { t: nowLabel, tds }]
      return next.slice(-36)
    })
  }, [tds])

  const safety = useMemo(() => computeSafety({ ph, tds }), [ph, tds])

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isLive={isLive} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          <StatusBanner
            status={safety.status}
            message={safety.message}
            lastUpdated={formatLastUpdated(lastUpdated)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              <SensorCard
                key={`ph-${ph ?? 'na'}`}
                kind="ph"
                label="pH"
                value={ph}
                unit=""
                precision={2}
              />
              <SensorCard
                key={`temp-${temp ?? 'na'}`}
                kind="temp"
                label="Temperature"
                value={temp}
                unit="°C"
                precision={1}
              />
              <SensorCard
                key={`tds-${tds ?? 'na'}`}
                kind="tds"
                label="TDS"
                value={tds}
                unit="ppm"
                precision={0}
              />
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <AnalyticsChart
              data={phHistory}
              title="pH History (simulated)"
              unit=""
              dataKey="ph"
              color="rgb(34 211 238)" // cyan-400
              valueLabel="pH"
            />
            <AnalyticsChart
              data={tempHistory}
              title="Temperature History (simulated)"
              unit="°C"
              dataKey="temp"
              color="rgb(251 191 36)" // amber-400
              valueLabel="Temperature"
            />
            <AnalyticsChart
              data={tdsHistory}
              title="TDS History (simulated)"
              unit="ppm"
              dataKey="tds"
              color="rgb(167 139 250)" // violet-400
              valueLabel="TDS"
            />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
