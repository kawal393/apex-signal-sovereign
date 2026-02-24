type Props = { onNavigate: (p: "landing" | "bounties" | "terms" | "privacy" | "disclaimers") => void };

export default function Disclaimers({ onNavigate }: Props) {
  return (
    <div className="min-h-screen px-6 py-24 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="mb-8 text-slate-400 hover:text-white font-display font-bold tracking-wider uppercase text-sm transition-colors"
      >
        ← Back
      </button>
      <h1 className="font-display text-3xl font-bold text-amber-500 mb-2">Disclaimers</h1>
      <p className="text-slate-500 text-sm uppercase tracking-widest mb-10">Australia & worldwide</p>
      <div className="prose prose-invert prose-sm space-y-6 text-slate-300">
        <p>Nothing here is financial, investment, tax, or legal advice. Credits and stakes are in-platform utility only. No outcome is guaranteed; stakes can be burned. You participate at your own risk. Where applicable, mandatory consumer rights apply.</p>
      </div>
    </div>
  );
}
