import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { onValue, ref } from 'firebase/database'
import { Navbar } from './components/Navbar.jsx'
import { AnalyticsChart } from './components/AnalyticsChart.jsx'
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

  const [phHistory, setPhHistory] = useState([])
  const [tempHistory, setTempHistory] = useState([])
  const [tdsHistory, setTdsHistory] = useState([])

  const phLastValue = useRef(null)
  const tempLastValue = useRef(null)
  const tdsLastValue = useRef(null)

  useEffect(() => {
    if (!db) return

    const sensorsRef = ref(db, 'water')

    const unsub = onValue(
      sensorsRef,
      (snapshot) => {
        const v = snapshot.val() || {}

        // Map keys from Firebase: temperature, tds, ph, safe
        const nextTemp = toNumberOrNull(v.temperature)
        const nextTds = toNumberOrNull(v.tds)
        const nextPh = toNumberOrNull(v.ph)
        const nextSafe = toBooleanOrNull(v.safe)

        setTemperature(nextTemp)
        setTds(nextTds)
        setPh(nextPh)
        setSafe(nextSafe)

        // Append realtime history points (keep last 20 to avoid lag)
        if (nextPh !== null && nextPh !== phLastValue.current) {
          const point = {
            t: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            value: nextPh,
          }
          setPhHistory((prev) => [...prev, point].slice(-20))
          phLastValue.current = nextPh
        }

        if (nextTemp !== null && nextTemp !== tempLastValue.current) {
          const point = {
            t: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            value: nextTemp,
          }
          setTempHistory((prev) => [...prev, point].slice(-20))
          tempLastValue.current = nextTemp
        }

        if (nextTds !== null && nextTds !== tdsLastValue.current) {
          const point = {
            t: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            value: nextTds,
          }
          setTdsHistory((prev) => [...prev, point].slice(-20))
          tdsLastValue.current = nextTds
        }

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

            <div className="grid grid-cols-1 gap-4">
              <AnalyticsChart
                title="pH Trend"
                data={phHistory}
                dataKey="value"
                color="#22d3ee"
                unit=""
              />
              <AnalyticsChart
                title="Temperature Trend"
                data={tempHistory}
                dataKey="value"
                color="#fbbf24"
                unit="°C"
              />
              <AnalyticsChart
                title="TDS Trend"
                data={tdsHistory}
                dataKey="value"
                color="#a78bfa"
                unit="ppm"
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}