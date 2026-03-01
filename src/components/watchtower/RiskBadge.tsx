import { cn } from "@/lib/utils";

const riskStyles: Record<string, string> = {
  HIGH: "border-red-500/30 text-red-400 bg-red-500/10",
  MED: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  LOW: "border-green-500/30 text-green-400 bg-green-500/10",
};

export default function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={cn(
      "text-[10px] uppercase tracking-widest px-2 py-1 rounded border whitespace-nowrap",
      riskStyles[risk] || "border-border text-muted-foreground"
    )}>
      {risk}
    </span>
  );
}
