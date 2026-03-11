import { Droplet } from 'lucide-react'

export function Navbar({ isLive }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-xl bg-slate-900/60 ring-1 ring-slate-800/70">
            <Droplet className="size-5 text-cyan-300" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-slate-100">
              Smart Water Bottle
            </div>
            <div className="text-xs text-slate-400">Realtime sensor dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1',
              isLive
                ? 'bg-emerald-500/10 text-emerald-200 ring-emerald-500/30'
                : 'bg-slate-500/10 text-slate-200 ring-slate-500/30',
            ].join(' ')}
          >
            <span
              className={[
                'size-2 rounded-full',
                isLive ? 'bg-emerald-400' : 'bg-slate-400',
              ].join(' ')}
            />
            {isLive ? 'LIVE' : 'DEMO'}
          </span>
        </div>
      </div>
    </header>
  )
}


