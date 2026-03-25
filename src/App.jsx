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
  return d.toLocaleTimeString()
}

function computeSafety({ ph, tds, temp }) {
  const hasNumbers = typeof ph === 'number' && typeof tds === 'number'
  if (!hasNumbers) {
    return {
      status: 'UNSAFE',
      message: 'Waiting for valid sensor data...',
    }
  }

  // Matching your ESP32 safety logic: 
  // TDS <= 400, pH 6.5-8.5, Temp 10-45
  const phOk = ph >= 6.5 && ph <= 8.5
  const tdsOk = tds <= 400
  const tempOk = temp >= 10 && temp <= 45

  if (phOk && tdsOk && tempOk) {
    return { status: 'SAFE', message: 'Water looks within safe limits.' }
  }

  let issues = []
  if (!phOk) issues.push("pH out of range (6.5-8.5)")
  if (!tdsOk) issues.push("TDS too high (> 400 ppm)")
  if (!tempOk) issues.push("Temperature outside safe range (10-45°C)")

  return {
    status: 'UNSAFE',
    message: issues.join(' | '),
  }
}

export default function App() {
  const [ph, setPh] = useState(null)
  const [tds, setTds] = useState(null)
  const [temp, setTemp] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isLive, setIsLive] = useState(false)

  // History states for the charts
  const [phHistory, setPhHistory] = useState([])
  const [tempHistory, setTempHistory] = useState([])
  const [tdsHistory, setTdsHistory] = useState([])

  useEffect(() => {
    if (!db) return

    // UPDATED PATH: Points to '/water' to match your ESP32 code
    const sensorsRef = ref(db, 'water')
    
    const unsub = onValue(
      sensorsRef,
      (snapshot) => {
        const v = snapshot.val() || {}
        
        // Mapping keys from ESP32: temperature, ph, tds
        setPh(toNumberOrNull(v.ph))
        setTds(toNumberOrNull(v.tds))
        setTemp(toNumberOrNull(v.temperature)) // Matches ESP32 'temperature' key
        setLastUpdated(Date.now())
        setIsLive(true)
      },
      (error) => {
        console.error("Firebase Auth/Rule Error:", error)
        setIsLive(false)
      },
    )

    return () => unsub()
  }, [])

  // Update history arrays when new values arrive
  useEffect(() => {
    if (ph === null) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setPhHistory(prev => [...prev, { t: time, ph }].slice(-20))
  }, [ph])

  useEffect(() => {
    if (temp === null) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTempHistory(prev => [...prev, { t: time, temp }].slice(-20))
  }, [temp])

  useEffect(() => {
    if (tds === null) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTdsHistory(prev => [...prev, { t: time, tds }].slice(-20))
  }, [tds])

  const safety = useMemo(() => computeSafety({ ph, tds, temp }), [ph, tds, temp])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar isLive={isLive} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <StatusBanner
            status={safety.status}
            message={safety.message}
            lastUpdated={formatLastUpdated(lastUpdated)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              <SensorCard kind="ph" label="pH Level" value={ph} unit="" precision={2} />
              <SensorCard kind="temp" label="Temperature" value={temp} unit="°C" precision={1} />
              <SensorCard kind="tds" label="TDS" value={tds} unit="ppm" precision={0} />
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-8">
            <AnalyticsChart 
              data={phHistory} title="pH Trend" dataKey="ph" 
              color="#22d3ee" unit="" valueLabel="pH" 
            />
            <AnalyticsChart 
              data={tempHistory} title="Temperature Trend" dataKey="temp" 
              color="#fbbf24" unit="°C" valueLabel="Temp" 
            />
            <AnalyticsChart 
              data={tdsHistory} title="TDS Trend" dataKey="tds" 
              color="#a78bfa" unit="ppm" valueLabel="TDS" 
            />
          </div>
        </motion.div>
      </main>
    </div>
  )
}