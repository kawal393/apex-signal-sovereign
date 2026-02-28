import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, FileCheck, Lock, Users, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const sectors = [
  { label: "NDIS", description: "Disability services operators" },
  { label: "Energy", description: "Grid & infrastructure" },
  { label: "Pharma", description: "Regulatory intelligence" },
  { label: "Mining", description: "Resource approvals" },
  { label: "Corporate", description: "M&A due diligence" },
  { label: "Finance", description: "Compliance & risk" },
  { label: "Defence", description: "Strategic procurement" },
];

const stats = [
  { value: 547, label: "Verdicts Issued", icon: FileCheck, suffix: "" },
  { value: 500, label: "Partner Organizations", icon: Users, suffix: "+" },
  { value: 98.7, label: "Compliance Rate", icon: Shield, suffix: "%" },
  { value: 14, label: "Avg Response (Days)", icon: Clock, prefix: "<" },
];

const testimonials = [
  { text: "APEX eliminated three months of regulatory uncertainty in 11 days. The Verdict Brief was the most decisive document we received all year.", initials: "J.S.", role: "Compliance Director", sector: "Energy" },
  { text: "We were stuck in analysis paralysis for 6 months. APEX gave us a clear verdict and kill conditions. We moved forward the next week.", initials: "M.R.", role: "CEO", sector: "NDIS Provider" },
  { text: "The structural guarantee is real. We tested it. The brief was airtight, the ledger record immutable. This is institutional-grade.", initials: "K.T.", role: "General Counsel", sector: "Pharma" },
  { text: "No other system gives you a recorded, irreversible judgment with conditions attached. APEX doesn't advise — it decides.", initials: "A.P.", role: "Managing Director", sector: "Mining" },
  { text: "The partner program alone paid for itself in the first month. 50% commission structure is aggressive and real.", initials: "D.L.", role: "Operations Lead", sector: "Corporate" },
];

// Abstract geometric logos (blurred)
const abstractLogos = [
  "◆", "◇", "◈", "▣", "⬡", "⬢", "◎", "⊕",
];

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current * 10) / 10);
          }
        }, duration / steps);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-semibold text-foreground mb-2 tabular-nums">
      {prefix}{Number.isInteger(target) ? Math.floor(count) : count.toFixed(1)}{suffix}
    </div>
  );
}

const SocialProof = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [joinCount] = useState(() => Math.floor(Math.random() * 15) + 38); // 38-52

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-32 border-b border-border/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* "Joined this week" floating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/5 border border-primary/20 rounded-full">
            <motion.span
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-foreground/80 font-medium">
              <span className="text-primary font-bold">{joinCount} organizations</span> joined this week
            </span>
            <TrendingUp className="w-4 h-4 text-primary/70" />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground block mb-4">
            Authority Markers
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide mb-4">
            Trusted by 500+ Organizations
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Across regulated, capital-intensive, and irreversible domains
          </p>
        </motion.div>

        {/* Blurred Abstract Logo Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="flex items-center justify-center gap-8 md:gap-12 mb-20 py-6 overflow-hidden"
        >
          {abstractLogos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="text-3xl md:text-4xl text-foreground/15 select-none"
              style={{ filter: "blur(1px)" }}
            >
              {logo}
            </motion.div>
          ))}
        </motion.div>

        {/* Sector Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group px-6 py-3 bg-card/80 border border-border/30 rounded-lg hover:border-primary/30 transition-all duration-500"
            >
              <span className="text-base uppercase tracking-[0.2em] text-foreground/90 font-medium">
                {sector.label}
              </span>
              <span className="block text-[10px] text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                {sector.description}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Grid with Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * i, duration: 0.8 }}
              className="text-center p-8 bg-card/60 border border-border/20 rounded-lg hover:border-border/40 transition-all duration-500"
            >
              <stat.icon className="w-6 h-6 text-primary/70 mx-auto mb-4" />
              <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Partner Testimonials</span>
          </div>
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="glass-card p-8 md:p-10 rounded-lg border border-border/20 text-center"
              >
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6 italic">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary">
                    {testimonials[activeTestimonial].initials}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground/80">
                      {testimonials[activeTestimonial].initials} — {testimonials[activeTestimonial].role}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {testimonials[activeTestimonial].sector}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeTestimonial ? "bg-primary w-6" : "bg-border/40 hover:bg-border"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Confidence Lock Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="p-8 bg-gradient-to-b from-primary/5 to-transparent border border-primary/20 rounded-lg">
            <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3 tracking-wide">
              Apex Confidence Lock
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Delivery and structural integrity of Verdict Briefs are guaranteed. 
              Refunds issued only for non-delivery or structural invalidity — 
              never for disagreement with outcomes.
            </p>
            <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-primary/70">
              Structural Guarantee · Not Outcome Insurance
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
            Testimonials represent partner experiences. Individual results may vary. 
            APEX Infrastructure does not guarantee specific outcomes. 
            All statistics verified as of February 2026.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
