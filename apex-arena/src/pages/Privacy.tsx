type Props = { onNavigate: (p: "landing" | "bounties" | "terms" | "privacy" | "disclaimers") => void };

export default function Privacy({ onNavigate }: Props) {
  return (
    <div className="min-h-screen px-6 py-24 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="mb-8 text-slate-400 hover:text-white font-display font-bold tracking-wider uppercase text-sm transition-colors"
      >
        ← Back
      </button>
      <h1 className="font-display text-3xl font-bold text-amber-500 mb-2">Privacy</h1>
      <p className="text-slate-500 text-sm uppercase tracking-widest mb-10">Australia & global</p>
      <div className="prose prose-invert prose-sm space-y-6 text-slate-300">
        <p>We collect account and usage data necessary to operate the protocol. We do not sell your data. We comply with applicable data protection law (e.g. Australian Privacy Principles, GDPR where relevant). You may request access or deletion of your data.</p>
      </div>
    </div>
  );
}
