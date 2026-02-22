import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { ApexButton } from "@/components/ui/apex-button";
import { Textarea } from "@/components/ui/textarea";

const mockTranslations = [
    "Translation: They are burning cash faster than expected and will likely dilute shareholders within 90 days to survive.",
    "Translation: The CEO is being managed out by the board, and this 'strategic review' is just cover for selling off the profitable divisions.",
    "Translation: The regulatory hurdle they claimed was 'routine' has actually completely blocked their pathway to market. This project is dead.",
    "Translation: They are trying to hide a massive write-down in their legacy commercial real estate portfolio by blaming 'macroeconomic headwinds'.",
    "Translation: The 'synergies' from this merger are fabricated. This is a defensive acquisition to stop a competitor from taking their market share."
];

export default function CorporateTranslator() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);

    const handleTranslate = () => {
        if (!input.trim()) return;

        setIsTranslating(true);
        setOutput("");

        // Simulate API delay
        setTimeout(() => {
            const randomTranslation = mockTranslations[Math.floor(Math.random() * mockTranslations.length)];
            setOutput(randomTranslation);
            setIsTranslating(false);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen bg-black">
            <AmbientParticles />
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-black/80" />
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
                            <span className="status-active">LIVE SIGNAL</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500">Corporate Translator Node</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">Instutional Intent <span className="text-gradient-gold">Decoder</span></h1>
                        <p className="text-grey-400 max-w-2xl text-lg leading-relaxed mb-12">
                            Paste public filings, press releases, or executive communications. The APEX engine will strip the corporate obfuscation and translate it into operational reality.
                        </p>
                    </motion.div>

                    {/* Interface */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {/* Input */}
                        <div className="glass-card p-6 border-grey-800/50 flex flex-col">
                            <h3 className="text-xs uppercase tracking-[0.3em] text-grey-500 mb-4">Input: Institutional Language</h3>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste corporate announcement, prospectus excerpt, or PR release here..."
                                className="flex-1 bg-black/50 border-grey-800 focus:border-primary/50 text-grey-300 min-h-[300px] text-sm leading-relaxed resize-none mb-6"
                            />
                            <ApexButton
                                variant="primary"
                                className="w-full gap-2"
                                onClick={handleTranslate}
                                disabled={isTranslating || !input.trim()}
                            >
                                {isTranslating ? (
                                    <><RefreshCw className="w-4 h-4 animate-spin" /> DECODING INTENT...</>
                                ) : (
                                    <><Wand2 className="w-4 h-4" /> STRIP CORPORATE OBFUSCATION</>
                                )}
                            </ApexButton>
                        </div>

                        {/* Output */}
                        <div className="glass-card p-6 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <h3 className="text-xs uppercase tracking-[0.3em] text-primary mb-4 flex items-center justify-between">
                                <span>Output: Operational Reality</span>
                                {output && <span className="text-[9px] text-grey-500 bg-black/50 px-2 py-1 rounded">DECODED</span>}
                            </h3>

                            <div className="flex-1 bg-black/40 border border-grey-800/50 rounded-md p-6 text-sm leading-relaxed 
                font-mono relative">
                                {isTranslating ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/50 gap-4">
                                        <span className="text-3xl animate-pulse">◆</span>
                                        <span className="text-[10px] uppercase tracking-widest">Running dependency matrix...</span>
                                    </div>
                                ) : output ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <p className="text-grey-200">{output}</p>
                                        <div className="mt-8 pt-4 border-t border-primary/20">
                                            <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-2">Analysis Complete</p>
                                            <p className="text-xs text-grey-500">Confidence: 89% | Source: Lexical Sentiment Drift</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-grey-600 text-xs uppercase tracking-widest opacity-50">
                                        Awaiting Input Feed
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <ApexFooter />
        </div>
    );
}
