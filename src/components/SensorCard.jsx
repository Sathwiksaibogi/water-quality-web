import { motion } from 'framer-motion'
import { Activity, Droplet, Thermometer } from 'lucide-react'
import { cn } from '../lib/cn.js'

const iconByKind = {
  ph: Droplet,
  temp: Thermometer,
  tds: Activity,
}

const accentByKind = {
  ph: 'text-cyan-200',
  temp: 'text-amber-200',
  tds: 'text-violet-200',
}

const glowByKind = {
  ph: 'shadow-[0_0_0_1px_rgba(34,211,238,0.30),0_0_28px_rgba(34,211,238,0.18)]',
  temp: 'shadow-[0_0_0_1px_rgba(251,191,36,0.30),0_0_28px_rgba(251,191,36,0.18)]',
  tds: 'shadow-[0_0_0_1px_rgba(167,139,250,0.30),0_0_28px_rgba(167,139,250,0.18)]',
}

function formatValue(value, precision) {
  if (typeof value !== 'number') return '—'
  if (!Number.isFinite(value)) return '—'
  if (typeof precision !== 'number') return String(value)
  return value.toFixed(precision)
}

export function SensorCard({ kind, label, value, unit, precision = 0 }) {
  const Icon = iconByKind[kind] ?? Activity
  const accent = accentByKind[kind] ?? 'text-slate-200'
  const glow = glowByKind[kind] ?? ''
  const formattedValue = formatValue(value, precision)

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl',
        glow,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <motion.div
              key={`${kind}-${formattedValue}`}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="text-3xl font-semibold tracking-tight text-slate-50"
            >
              {formattedValue}
            </motion.div>
            <div className="text-sm text-slate-300">{unit}</div>
          </div>
        </div>

        <div
          className={cn(
            'grid size-11 place-items-center rounded-2xl bg-slate-950/40 ring-1 ring-slate-800/60',
            accent,
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>
      </div>
    </motion.section>
  )
}


