import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn } from '../lib/cn.js'

export function StatusBanner({ status, message, lastUpdated }) {
  const isSafe = status === 'SAFE'
  const Icon = isSafe ? ShieldCheck : ShieldAlert

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border p-5 backdrop-blur-xl',
        isSafe
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-rose-500/30 bg-rose-500/10',
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'grid size-11 place-items-center rounded-2xl ring-1',
              isSafe
                ? 'bg-emerald-950/30 text-emerald-200 ring-emerald-500/30'
                : 'bg-rose-950/30 text-rose-200 ring-rose-500/30',
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Safety Status
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <div
                className={cn(
                  'text-lg font-semibold tracking-tight',
                  isSafe ? 'text-emerald-200' : 'text-rose-200',
                )}
              >
                {isSafe ? 'SAFE' : 'UNSAFE'}
              </div>
              <div className="text-sm text-slate-200">{message}</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300">
          <span className="text-slate-400">Last updated:</span>{' '}
          <span className="font-medium text-slate-200">{lastUpdated}</span>
        </div>
      </div>
    </motion.section>
  )
}


