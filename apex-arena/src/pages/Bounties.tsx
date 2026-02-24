type Props = { onNavigate: (p: "landing" | "bounties" | "terms" | "privacy" | "disclaimers") => void };

export default function Bounties({ onNavigate }: Props) {
  return (
    <div className="min-h-screen px-6 py-24 max-w-5xl mx-auto">
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="mb-8 text-slate-400 hover:text-white font-display font-bold tracking-wider uppercase text-sm transition-colors"
      >
        ← BACK TO ARENA
      </button>

      <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
        BOUNTY BOARD
      </h1>
      <p className="text-slate-400 text-lg mb-12">
        Missions. Stakes. No second chances.
      </p>

      {/* Placeholder grid — no backend */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-slate-400 text-lg mb-4">
          Connect your backend to load live bounties.
        </p>
        <p className="text-slate-500 text-sm">
          This is your arena. Operators stake credits, claim missions, complete or burn.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-6 text-left">
            <div className="text-xs font-display font-bold tracking-widest text-amber-500 uppercase mb-2">
              Mission slot {i}
            </div>
            <div className="text-white font-display font-bold text-lg">—</div>
            <div className="text-slate-500 text-sm mt-2">Reward · Stake · Type</div>
          </div>
        ))}
      </div>
    </div>
  );
}
