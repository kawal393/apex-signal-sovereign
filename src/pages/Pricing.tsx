import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Shield } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { ApexButton } from "@/components/ui/apex-button";
import { useIsMobile } from "@/hooks/use-mobile";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { useGeo, convertPrice } from "@/contexts/GeoContext";

const tiers = [
  {
    name: "Standard Invocation Window",
    price: "$249",
    delivery: "Sealed within 72 hours",
    description: "Structured judgment for a single decision domain.",
    features: [
      "5-element Verdict structure",
      "Advance / Hold / Partner-Only / Drop",
      "Confidence level + 3 structural reasons",
      "Next cheapest test",
      "Kill rule (stop condition)",
      "Unsealed ledger entry",
    ],
    cta: "Request Standard Verdict",
    popular: true,
    href: "https://buy.stripe.com/14AfZ98ohcL6fUI9kob7y03",
  },
  {
    name: "Complex Invocation Window",
    price: "$999",
    delivery: "Sealed within 5–10 business days",
    description: "Multi-factor analysis across overlapping domains or counterparties.",
    features: [
      "Everything in Standard",
      "Multi-domain cross-reference",
      "Counterparty dependency mapping",
      "Extended structural analysis",
      "Priority queue processing",
      "Unsealed ledger entry",
    ],
    cta: "Request Complex Verdict",
    popular: false,
    href: "https://buy.stripe.com/00waEPeMF26s0ZO1RWb7y04",
  },
  {
    name: "Partner / Retainer",
    price: "By Invitation",
    delivery: "Continuous",
    description: "Sealed access, continuous monitoring, and citeable verdicts.",
    features: [
      "Everything in Complex",
      "Sealed ATA Ledger entries (citeable)",
      "Continuous signal monitoring",
      "Priority communication channel",
      "Access to sealed nodes",
      "Partnership Register: [REDACTED BY NDA]",
    ],
    cta: "Request Access",
    popular: false,
    isPartner: true,
  },
];

const Pricing = () => {
  const isMobile = useIsMobile();
  const geo = useGeo();

  const getPrice = (audPrice: number) => convertPrice(audPrice, geo);

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <AmbientParticles />
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.06)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
              Verdict Authority
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              <span className="text-gradient-gold">Access Conditions</span>
            </h1>
            <p className="text-grey-300 max-w-xl mx-auto text-lg leading-relaxed mb-4">
              Structured judgment for irreversible decisions. Clear deliverables. No ambiguity.
            </p>
            <p className="text-grey-300 text-base italic max-w-lg mx-auto">
              Price is a filter for seriousness, not a value explanation.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-card p-8 flex flex-col relative ${tier.popular
                  ? 'border-primary/40 shadow-[0_0_60px_hsl(42_95%_55%/0.12)]'
                  : 'border-grey-700/30'
                  }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 status-active text-[8px]">
                    MOST SELECTED
                  </span>
                )}

                <h3 className="text-lg font-medium text-foreground mb-2">{tier.name}</h3>
                <p className="text-grey-300 text-base mb-6">{tier.description}</p>

                <div className="mb-6">
                  <span className="text-grey-400 text-base block mb-1">{tier.delivery}</span>
                  <span className="text-2xl font-medium text-foreground/80">
                    {tier.price === "By Invitation" ? tier.price : getPrice(tier.price === "$249" ? 249 : 999)}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-base text-grey-400">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.isPartner ? (
                  <Link to="/request-access" className="mt-auto block">
                    <ApexButton
                      variant={tier.popular ? "primary" : "outline"}
                      size="lg"
                      className={`w-full gap-2 ${tier.popular ? 'text-white font-bold' : ''}`}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4" />
                    </ApexButton>
                  </Link>
                ) : (
                  <a href={tier.href} target="_blank" rel="noopener noreferrer" className="mt-auto block">
                    <ApexButton
                      variant={tier.popular ? "primary" : "outline"}
                      size="lg"
                      className={`w-full gap-2 ${tier.popular ? 'text-white font-bold' : ''}`}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4" />
                    </ApexButton>
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Confidence Lock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="glass-card p-8 max-w-2xl mx-auto text-center border-grey-700/30"
          >
            <Shield className="w-6 h-6 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-3">Confidence Lock Guarantee</h3>
            <p className="text-grey-400 text-base leading-relaxed mb-4">
              Every Verdict Brief is guaranteed to contain the 5 required structural elements.
              Refunds are issued only for structural incompleteness (missing required elements)
              or delivery failure. Disagreement with the verdict outcome is not grounds for refund.
            </p>
            <p className="text-grey-600 text-base">
              Apex delivers judgment, not comfort.
            </p>
          </motion.div>

          {/* Response line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center text-grey-600 text-base tracking-wide mt-8"
          >
            Response: 24–48h | Standard delivery: 72h | Australia-first
          </motion.p>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Pricing;
