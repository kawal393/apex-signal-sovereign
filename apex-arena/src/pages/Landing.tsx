type Props = { onNavigate: (p: "landing" | "bounties" | "terms" | "privacy" | "disclaimers") => void };

export default function Landing({ onNavigate }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* High-contrast badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 border border-amber-500/40 bg-amber-950/30 rounded text-amber-400 text-sm font-display font-bold tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        SOVEREIGN PROTOCOL ACTIVE
      </div>

      {/* Hero — big, readable */}
      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-6">
        <span className="text-white">STAKE.</span>
        <br />
        <span className="text-gold glow-gold">EXECUTE.</span>
        <br />
        <span className="text-white">DOMINATE.</span>
      </h1>

      <p className="text-xl md:text-2xl text-slate-300 max-w-xl mx-auto mb-14 font-medium">
        The arena where operators back their skills with real stakes.
        Complete the mission or <span className="text-red-400 font-bold">lose everything</span>.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate("bounties")}
          className="px-10 py-4 rounded-lg font-display font-bold text-lg tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-900/40 transition-colors"
        >
          ENTER THE ARENA
        </button>
        <button
          type="button"
          onClick={() => onNavigate("bounties")}
          className="px-10 py-4 rounded-lg font-display font-bold text-lg tracking-wider uppercase border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition-colors"
        >
          VIEW BOUNTIES
        </button>
      </div>

      {/* Stats placeholder — no API */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mt-20">
        {["OPERATORS", "BOUNTIES", "STAKED", "BURNED"].map((label) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-6 py-4">
            <div className="text-2xl font-display font-black text-gold tabular-nums">—</div>
            <div className="text-xs font-bold tracking-widest text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <p className="mt-16 text-sm text-slate-500">
        APEX BOUNTY · SOVEREIGN PROTOCOL
      </p>
    </div>
  );
}
