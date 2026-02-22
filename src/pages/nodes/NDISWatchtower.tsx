import { motion } from "framer-motion";
import { ArrowLeft, Database, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { ApexButton } from "@/components/ui/apex-button";

const mockSignals = [
    { provider: "Caring Hands Reg...", region: "VIC - Metro", status: "Section 73 Audit", risk: "CRITICAL", date: "2024-04-12" },
    { provider: "Horizon Support S...", region: "NSW - Regional", status: "Registration Suspended", risk: "HIGH", date: "2024-04-10" },
    { provider: "Better Living Aust...", region: "QLD - Metro", status: "Pricing Band Violation", risk: "MEDIUM", date: "2024-04-08" },
    { provider: "Apex Care Provider...", region: "WA - Regional", status: "Director Cross-Check", risk: "ELEVATED", date: "2024-04-05" },
    // These will be blurred
    { provider: "Redacted Entity A...", region: "NSW - Metro", status: "Redacted Signal Data", risk: "HIGH", date: "2024-04-01" },
    { provider: "Redacted Entity B...", region: "VIC - Regional", status: "Redacted Signal Data", risk: "CRITICAL", date: "2024-03-28" },
    { provider: "Redacted Entity C...", region: "QLD - Regional", status: "Redacted Signal Data", risk: "MEDIUM", date: "2024-03-25" },
    { provider: "Redacted Entity D...", region: "SA - Metro", status: "Redacted Signal Data", risk: "HIGH", date: "2024-03-20" },
    { provider: "Redacted Entity E...", region: "TAS - Regional", status: "Redacted Signal Data", risk: "CRITICAL", date: "2024-03-15" }
];

export default function NDISWatchtower() {
    return (
        <div className="relative min-h-screen bg-black">
            <AmbientParticles />
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(42_50%_15%/0.15)_0%,transparent_70%)]" />
            </div>

            <ApexNav />

            <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                {/* Header */}
                <Link to="/nodes" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-500 hover:text-grey-300 transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    All Nodes
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="status-active">LIVE STREAM</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500">Compliance & Pricing Board</span>
                            <Database className="w-3.5 h-3.5 text-primary ml-2 animate-pulse" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">NDIS <span className="text-gradient-gold">Watchtower</span></h1>
                        <p className="text-grey-400 text-lg leading-relaxed">
                            Real-time ingestion of AAT decisions, NDIS Commission enforcement actions, and provider registration shifts.
                            Only the latest 4 signals are unsealed for public view.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex-shrink-0"
                    >
                        <Link to="/request-access">
                            <ApexButton variant="primary" size="lg" className="gap-2">
                                <Lock className="w-4 h-4" /> UNLOCK FULL INDEX
                            </ApexButton>
                        </Link>
                    </motion.div>
                </div>

                {/* Data Table */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="relative glass-card border-none overflow-hidden"
                >
                    {/* Blur Overlay - The sovereign trap */}
                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/90 to-transparent z-10 flex flex-col items-center justify-end pb-20 pointer-events-none">
                        <h3 className="text-xl font-medium text-foreground mb-4 tracking-wide">642 Signals Obfuscated</h3>
                        <p className="text-grey-400 text-sm max-w-md text-center mb-6">
                            The full Watchtower matrix is restricted to Tier 3 Partners and Retainer clients.
                        </p>
                        <Link to="/request-access" className="pointer-events-auto">
                            <ApexButton variant="outline" className="text-primary border-primary hover:bg-primary/10">
                                REQUEST ACCESS CREDENTIALS
                            </ApexButton>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-grey-800 text-[10px] uppercase tracking-[0.3em] text-grey-500 bg-black/40">
                                    <th className="p-6 font-medium">Provider Target</th>
                                    <th className="p-6 font-medium">Region</th>
                                    <th className="p-6 font-medium">Signal Event</th>
                                    <th className="p-6 font-medium">Risk Vector</th>
                                    <th className="p-6 font-medium">Capture Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {mockSignals.map((signal, index) => {
                                    const isBlurred = index >= 4;
                                    return (
                                        <tr
                                            key={index}
                                            className={`
                        border-b border-grey-800/50 transition-colors
                        ${isBlurred ? 'opacity-30 blur-[4px] select-none' : 'hover:bg-grey-900/30'}
                      `}
                                        >
                                            <td className={`p-6 ${!isBlurred ? 'text-grey-200 font-medium' : 'text-grey-600'}`}>
                                                {signal.provider}
                                            </td>
                                            <td className={`p-6 ${!isBlurred ? 'text-grey-400' : 'text-grey-600'}`}>
                                                {signal.region}
                                            </td>
                                            <td className={`p-6 ${!isBlurred ? 'text-grey-300' : 'text-grey-600'}`}>
                                                {signal.status}
                                            </td>
                                            <td className="p-6">
                                                <span className={`
                          text-[10px] uppercase tracking-widest px-2 py-1 rounded border
                          ${isBlurred ? 'border-grey-800 text-grey-700 bg-transparent' :
                                                        signal.risk === 'CRITICAL' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                                            signal.risk === 'HIGH' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                                                                'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                                    }
                        `}>
                                                    {signal.risk}
                                                </span>
                                            </td>
                                            <td className={`p-6 font-mono text-xs ${!isBlurred ? 'text-grey-500' : 'text-grey-700'}`}>
                                                {signal.date}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>

            <ApexFooter />
        </div>
    );
}
