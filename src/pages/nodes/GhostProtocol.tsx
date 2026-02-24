import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal, Activity, ShieldAlert, Cpu, Key, Server } from "lucide-react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";

interface HealthStatus {
    status: string;
    last_checked: string;
    latency_ms: number;
}

interface EmpireHealth {
    overall_health: string;
    nodes_checked: number;
    results: Record<string, HealthStatus>;
    timestamp: string;
}

interface VaultKeys {
    status: string;
    keys_stored: number;
    keys: string[];
    timestamp: string;
}

const API_BASE = "http://localhost:8000/api/v1";

export default function GhostProtocol() {
    const [empireHealth, setEmpireHealth] = useState<EmpireHealth | null>(null);
    const [vaultKeys, setVaultKeys] = useState<VaultKeys | null>(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchGhostData = async () => {
            try {
                const [healthRes, keysRes] = await Promise.all([
                    fetch(`${API_BASE}/empire/health`),
                    fetch(`${API_BASE}/ghost/vault/keys`)
                ]);

                if (healthRes.ok) {
                    const hData = await healthRes.json();
                    setEmpireHealth(hData);
                }
                if (keysRes.ok) {
                    const kData = await keysRes.json();
                    setVaultKeys(kData);
                }
            } catch (err) {
                console.error("Failed to connect to Titanium Vault", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGhostData();
        const interval = setInterval(fetchGhostData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const formatPillarName = (key: string) => {
        return key.replace(/_/g, " ");
    };

    return (
        <div className="relative min-h-screen bg-black">
            <AmbientParticles />
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-black/90" />
            </div>

            <ApexNav />

            <main className="relative z-10 pt-32 pb-24 px-6 mb-20">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <Link to="/nodes" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-300 hover:text-white transition-colors mb-12">
                        <ArrowLeft className="w-4 h-4" />
                        Infrastructure Maps
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="status-frozen text-purple-light border-purple-mid/50 bg-purple-900/10">TITANIUM VAULT ONLINE</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-300">Command Center Security Layer</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">Internal <span className="text-gradient-purple">Ghost Protocol</span></h1>

                        <div className="glass-card p-6 border-l-2 border-purple-mid/50 mb-12 bg-black/50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <ShieldAlert className="w-32 h-32" />
                            </div>
                            <p className="text-grey-300 text-lg leading-relaxed relative z-10">
                                This dashboard connects securely to the local Python Headless Core. All credentials and uptime monitors are managed off-DOM in the centralized backend architecture.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Sovereign Health Monitor (Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="glass-card p-8 border-grey-800/50 min-h-[500px]">
                                <h3 className="text-base uppercase tracking-[0.3em] text-grey-400 mb-6 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" /> Empire Health Stream</span>
                                    {empireHealth?.overall_health === 'green' ? (
                                        <span className="text-green-500 text-xs">● NOMINAL</span>
                                    ) : (
                                        <span className="text-red-500 text-xs animate-pulse">● DEGRADED</span>
                                    )}
                                </h3>

                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="text-center text-grey-600 font-mono py-12 animate-pulse">ESTABLISHING UPLINK...</div>
                                    ) : empireHealth ? (
                                        Object.entries(empireHealth.results).map(([nodeName, data], idx) => (
                                            <div key={idx} className="border border-grey-800 rounded bg-black/40 p-5 flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="uppercase tracking-widest text-white text-sm flex items-center gap-2">
                                                        <Server className="w-3 h-3 text-grey-500" />
                                                        {formatPillarName(nodeName)}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-1 rounded border uppercase tracking-widest ${data.status === 'online' ? 'text-green-400 border-green-900/50 bg-green-900/10' :
                                                            data.status === 'degraded' ? 'text-yellow-400 border-yellow-900/50 bg-yellow-900/10' :
                                                                'text-red-400 border-red-900/50 bg-red-900/10'
                                                        }`}>
                                                        {data.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] text-grey-500 font-mono">
                                                    <span>LATENCY: {data.latency_ms}ms</span>
                                                    <span>PULSE: {new Date(data.last_checked).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-red-500/50 font-mono py-12">UPLINK FAILED. CORE IS OFFLINE.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Titanium Vault Keys (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="glass-card p-8 border-grey-800/50 flex flex-col relative overflow-hidden min-h-[500px]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-grey-800/50">
                                <span className="text-base uppercase tracking-[0.3em] text-grey-400 flex items-center gap-2">
                                    <Key className="w-4 h-4 text-purple-400" /> Encrypted Vault Register
                                </span>
                            </div>

                            <div className="text-grey-500 text-sm mb-6 leading-relaxed">
                                Secrets are encrypted using PBKDF2 HMAC SHA-256 and never transmitted to the frontend DOM. Displaying abstract key identifiers only.
                            </div>

                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto space-y-3 pr-2"
                                style={{ scrollbarWidth: 'none' }}
                            >
                                {loading ? (
                                    <div className="text-center text-grey-600 font-mono py-12 animate-pulse">DECRYPTING MANIFEST...</div>
                                ) : vaultKeys?.keys && vaultKeys.keys.length > 0 ? (
                                    vaultKeys.keys.map((keyName, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="font-mono text-sm tracking-widest bg-grey-900/30 border border-grey-800 p-3 rounded text-purple-100 flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                            {keyName}
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center text-grey-600 font-mono py-12 border border-dashed border-grey-800 rounded">
                                        VAULT IS EMPTY. NO SECRETS SECURED.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <ApexFooter />
        </div>
    );
}
