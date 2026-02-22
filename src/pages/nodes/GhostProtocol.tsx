import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Terminal, Activity, ShieldAlert, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { ApexButton } from "@/components/ui/apex-button";
import { Input } from "@/components/ui/input";

const mockTerminalSteps = [
    "INITIALIZING GHOST PROTOCOL...",
    "BYPASSING PERIMETER NOISE...",
    "LOCATING ENTITY DEPENDENCIES...",
    "MAPPING BOARD VECTORS...",
    "CROSS-REFERENCING ATO/ASIC FILINGS...",
    "ISOLATING COUNTERPARTY RISK...",
    "ANALYSIS COMPLETE: Entity structurally compromised."
];

export default function GhostProtocol() {
    const [target, setTarget] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const startProtocol = () => {
        if (!target.trim() || isActive) return;
        setIsActive(true);
        setTerminalOutput([`> TARGET LOCK: ${target.toUpperCase()}`]);

        mockTerminalSteps.forEach((step, index) => {
            setTimeout(() => {
                setTerminalOutput(prev => [...prev, `> ${step}`]);
                if (index === mockTerminalSteps.length - 1) {
                    setTimeout(() => setIsActive(false), 2000);
                }
            }, (index + 1) * 1200);
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    return (
        <div className="relative min-h-screen bg-black">
            <AmbientParticles />
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-black/90" />
            </div>

            <ApexNav />

            <main className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <Link to="/nodes" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-500 hover:text-grey-300 transition-colors mb-12">
                        <ArrowLeft className="w-4 h-4" />
                        All Nodes
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="status-frozen text-purple-light border-purple-mid/50 bg-purple-900/10">COVERT OPERATION</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500">Doctrine & Execution</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">Internal <span className="text-gradient-purple">Ghost Protocol</span></h1>

                        <div className="glass-card p-6 border-l-2 border-purple-mid/50 mb-12 bg-black/50">
                            <p className="text-grey-300 text-lg leading-relaxed">
                                Ghost Protocol is an operating doctrine: disciplined observation, triage, and escalation.
                                Process-based verification only. No execution. No representation. No impersonation.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Control Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="glass-card p-8 border-grey-800/50">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-grey-400 mb-6 flex items-center gap-2">
                                    <Terminal className="w-4 h-4" /> Signal Targeting
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-grey-500 block mb-2">Target Entity ABN / Name</label>
                                        <Input
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="e.g. 51 824 753 556"
                                            className="bg-black/80 border-grey-700 text-primary font-mono placeholder:text-grey-700 h-12 uppercase"
                                            disabled={isActive}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="border border-grey-800 rounded bg-black/40 p-4">
                                            <Cpu className="w-5 h-5 text-grey-600 mb-2" />
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500 block">Dependencies</span>
                                            <span className="text-sm font-medium text-grey-300">MAPPING</span>
                                        </div>
                                        <div className="border border-grey-800 rounded bg-black/40 p-4">
                                            <ShieldAlert className="w-5 h-5 text-grey-600 mb-2" />
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500 block">Footprint</span>
                                            <span className="text-sm font-medium text-grey-300">ZERO-TOUCH</span>
                                        </div>
                                    </div>

                                    <ApexButton
                                        variant="primary"
                                        className="w-full mt-4 h-12 border-purple-500 text-purple-light hover:bg-purple-900/20"
                                        onClick={startProtocol}
                                        disabled={!target.trim() || isActive}
                                    >
                                        INITIATE SILENT SCRAPE
                                    </ApexButton>
                                </div>
                            </div>
                        </motion.div>

                        {/* Terminal Output */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="glass-card p-6 border-purple-900/30 bg-black/80 flex flex-col relative overflow-hidden h-[400px]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-grey-800/50">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-purple-light">Terminal Pipeline</span>
                                {isActive && <Activity className="w-4 h-4 text-purple-400 animate-pulse" />}
                            </div>

                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto font-mono text-xs md:text-sm leading-loose space-y-2 pr-2"
                                style={{ scrollbarWidth: 'none' }}
                            >
                                <div className="text-grey-600 mb-4 opacity-50">
                                    AWAITING VANGUARD INITIATION...<br />
                                    SECURE CONNECTION ESTABLISHED.
                                </div>

                                <AnimatePresence>
                                    {terminalOutput.map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`${i === 0 ? 'text-primary' : i === terminalOutput.length - 1 && !isActive ? 'text-red-400 font-bold' : 'text-purple-300/80'}`}
                                        >
                                            {line}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <ApexFooter />
        </div>
    );
}
