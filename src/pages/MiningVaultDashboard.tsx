import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { ApexButton } from "@/components/ui/apex-button";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MOCK_TEASER_DATA = [
    { id: 1, project: "Pilbara Lithium Expansion", severity: "HIGH", issue: "EPA Review extended 180 days due to Native Title overlap.", date: "Today" },
    { id: 2, project: "Bowen Basin Coal Ext.", severity: "CRITICAL", issue: "Water allocation denied by state regulator.", date: "Yesterday" }
];

const MiningVaultDashboard = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [providerNumber, setProviderNumber] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleRequestAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !providerNumber) {
            toast({ title: "Validation Error", description: "All fields are required for clearance." });
            return;
        }

        // In a full implementation, this writes to the access_requests table
        toast({
            title: "Clearance Request Submitted",
            description: "Your credentials are being verified by APEX Command.",
        });
        setEmail("");
        setProviderNumber("");
    };

    return (
        <div className="relative min-h-screen bg-black">
            <AmbientParticles />
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-black/80" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.08)_0%,transparent_60%)]" />
            </div>

            <ApexNav />

            <main className="relative z-10 pt-32 pb-24 px-6 min-h-screen flex flex-col">
                <div className="max-w-4xl mx-auto w-full flex-grow">

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Link to="/nodes" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-500 hover:text-grey-300 transition-colors mb-12">
                            <ArrowLeft className="w-4 h-4" />
                            All Nodes
                        </Link>
                    </motion.div>

                    <header className="mb-12">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                            LIVE NODE
                        </span>
                        <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mt-6 mb-4">Mining & Land Constraint Vault</h1>
                        <p className="text-xl text-grey-300 leading-relaxed max-w-2xl">
                            Live monitoring of mining approvals, Native Title claims, and extraction bottlenecks.
                        </p>
                    </header>

                    {/* TEASER PROTOCOL UI */}
                    <section className="mb-12">
                        <h2 className="text-xs uppercase tracking-[0.4em] text-primary mb-6 flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4" />
                            Recent Constraint Alerts (Delayed 24h)
                        </h2>

                        <div className="glass-card overflow-hidden border-primary/20 relative">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-grey-800 bg-black/50">
                                    <tr>
                                        <th className="p-4 font-normal text-grey-500 text-[10px] uppercase tracking-wider">Date</th>
                                        <th className="p-4 font-normal text-grey-500 text-[10px] uppercase tracking-wider">Project</th>
                                        <th className="p-4 font-normal text-grey-500 text-[10px] uppercase tracking-wider">Severity</th>
                                        <th className="p-4 font-normal text-grey-500 text-[10px] uppercase tracking-wider">Constraint Issue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-grey-800/50">
                                    {MOCK_TEASER_DATA.map((row) => (
                                        <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-grey-400">{row.date}</td>
                                            <td className="p-4 text-grey-200 font-medium">{row.project}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] uppercase px-2 py-1 rounded ${row.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                    {row.severity}
                                                </span>
                                            </td>
                                            <td className="p-4 text-grey-400">{row.issue}</td>
                                        </tr>
                                    ))}
                                    {/* Blurred rows to show the depth of the data */}
                                    <tr className="filter blur-sm opacity-50 select-none pointer-events-none">
                                        <td className="p-4 text-grey-400">2 Days Ago</td>
                                        <td className="p-4 text-grey-200">BHP Olympic Dam</td>
                                        <td className="p-4 text-yellow-500">MEDIUM</td>
                                        <td className="p-4 text-grey-400">Water extraction compliance review initiated.</td>
                                    </tr>
                                    <tr className="filter blur-md opacity-30 select-none pointer-events-none">
                                        <td className="p-4 text-grey-400">3 Days Ago</td>
                                        <td className="p-4 text-grey-200">FMG Iron Bridge</td>
                                        <td className="p-4 text-red-500">SEVERE</td>
                                        <td className="p-4 text-grey-400">Aboriginal heritage impact delay.</td>
                                    </tr>
                                </tbody>
                            </table>

                            {!session && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-end pb-12">
                                    <Lock className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="text-xl font-medium text-white mb-2">Restricted Intelligence</h3>
                                    <p className="text-grey-400 text-sm max-w-md text-center">
                                        Full real-time constraints, permit tracking, and the historic database are restricted to verified resource operators and allocators.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* GATING / AUTHENTICATION BLOCK */}
                    {!session && (
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-8 border-primary/30 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <div className="max-w-xl mx-auto">
                                <h3 className="text-2xl font-medium text-foreground mb-4 text-center">Verify Domain Clearance</h3>
                                <p className="text-grey-400 text-sm text-center mb-8">
                                    Submit your corporate credentials to unlock the Mining & Land Constraint Vault.
                                </p>

                                <form onSubmit={handleRequestAccess} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-2">Corporate Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/50 border border-grey-800 rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="operator@miningcorp.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-2">Operator / Tenement Request ID</label>
                                        <input
                                            type="text"
                                            value={providerNumber}
                                            onChange={(e) => setProviderNumber(e.target.value)}
                                            className="w-full bg-black/50 border border-grey-800 rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="e.g. TEN-4921X"
                                        />
                                    </div>
                                    <ApexButton type="submit" variant="primary" className="w-full py-6 mt-4">
                                        SUBMIT FOR GATED CLEARANCE
                                    </ApexButton>
                                </form>
                            </div>
                        </motion.section>
                    )}

                </div>
            </main>
            <ApexFooter />
        </div>
    );
};

export default MiningVaultDashboard;
