import { motion } from "framer-motion";

interface Stat {
  label: string;
  value: string | number;
  color?: string;
}

export default function WatchtowerStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
          className="bg-card border border-border/20 rounded-xl p-5 text-center"
        >
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${s.color || 'text-primary'}`}>
            {s.value}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
