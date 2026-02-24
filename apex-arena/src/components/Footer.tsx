type Props = { onNavigate: (p: "landing" | "bounties" | "terms" | "privacy" | "disclaimers") => void };

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="border-t border-white/10 py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
        <button type="button" onClick={() => onNavigate("terms")} className="hover:text-amber-400 transition-colors">
          Terms of Sovereignty
        </button>
        <button type="button" onClick={() => onNavigate("privacy")} className="hover:text-amber-400 transition-colors">
          Privacy
        </button>
        <button type="button" onClick={() => onNavigate("disclaimers")} className="hover:text-amber-400 transition-colors">
          Disclaimers
        </button>
        <span className="text-slate-600">© {new Date().getFullYear()} APEX BOUNTY</span>
      </div>
    </footer>
  );
}
