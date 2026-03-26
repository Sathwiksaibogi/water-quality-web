import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn } from '../lib/cn.js'

export function StatusBanner({ safe }) {
  const isSafe = safe === true
  const Icon = isSafe ? ShieldCheck : ShieldAlert

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn(
        'w-full rounded-2xl border p-5 backdrop-blur-xl',
        isSafe
          ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.22)]'
          : 'border-rose-500/30 bg-rose-500/10 shadow-[0_0_30px_rgba(244,63,94,0.18)]',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'grid size-11 place-items-center rounded-2xl ring-1',
              isSafe
                ? 'bg-emerald-950/30 text-emerald-200 ring-emerald-500/30'
                : 'bg-rose-950/30 text-rose-200 ring-rose-500/30',
            )}
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Water Quality
            </div>
            <div
              className={cn(
                'mt-1 text-lg font-semibold tracking-tight',
                isSafe ? 'text-emerald-200' : 'text-rose-200',
              )}
            >
              {isSafe ? 'SAFE TO DRINK' : 'NOT SAFE'}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}


