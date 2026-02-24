type Props = { onNavigate: (p: "landing" | "bounties" | "terms" | "privacy" | "disclaimers") => void };

export default function Terms({ onNavigate }: Props) {
  return (
    <div className="min-h-screen px-6 py-24 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="mb-8 text-slate-400 hover:text-white font-display font-bold tracking-wider uppercase text-sm transition-colors"
      >
        ← Back
      </button>
      <h1 className="font-display text-3xl font-bold text-amber-500 mb-2">Terms of Sovereignty</h1>
      <p className="text-slate-500 text-sm uppercase tracking-widest mb-10">GMSA — 2026</p>
      <div className="prose prose-invert prose-sm space-y-6 text-slate-300">
        <p>
          Apex Bounty operates as a <strong className="text-white">Protocol Coordinator</strong>. Participants act as <strong className="text-white">Sovereign Independent Operators (SIOs)</strong>. You are responsible for your own taxes and legal compliance. Stakes function as <strong className="text-white">Collateral Bonds</strong> for service delivery, not investments. Disputes are subject to platform-facilitated resolution. Liability is limited to the maximum extent permitted by law (including Australian Consumer Law).
        </p>
        <p>By using the platform or staking, you agree to these terms.</p>
      </div>
    </div>
  );
}
