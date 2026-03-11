import { motion } from 'framer-motion'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '../lib/cn.js'

function TooltipContent({ active, payload, label, unit, valueLabel }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 backdrop-blur">
      <div className="text-slate-400">{label}</div>
      <div className="mt-1 font-medium">
        {valueLabel}:{' '}
        <span className="text-slate-50">{payload[0]?.value}</span>{' '}
        {unit}
      </div>
    </div>
  )
}

export function AnalyticsChart({
  data,
  title,
  unit,
  dataKey,
  color = 'rgb(167 139 250)',
  valueLabel,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/25 p-5 backdrop-blur-xl',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Analytics
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-100">
            {title}
          </div>
        </div>
        <div className="text-xs text-slate-400">Last ~36 points</div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="t"
              tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
              tickMargin={8}
              axisLine={{ stroke: 'rgba(148,163,184,0.25)' }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={
                <TooltipContent
                  unit={unit}
                  valueLabel={valueLabel ?? title}
                />
              }
              cursor={false}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
