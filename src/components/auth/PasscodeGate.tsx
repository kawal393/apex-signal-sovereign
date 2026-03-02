import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = sessionStorage.getItem("apex_auth");
        if (auth === "true" || localStorage.getItem("apex_auth_persistent") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Validate against master passcode
        const MASTER_PASSCODE = "199131";

        if (passcode === MASTER_PASSCODE) {
            sessionStorage.setItem("apex_auth", "true");
            localStorage.setItem("apex_auth_persistent", "true");
            setIsAuthenticated(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
            setPasscode("");
        }
        setLoading(false);
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,hsl(0_0%_10%/1)_0%,black_100%)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 border-grey-800/50 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />

                <Lock className="w-8 h-8 text-grey-300 mx-auto mb-6" />
                <h2 className="text-xl font-medium text-grey-300 tracking-[0.2em] uppercase mb-2">Restricted Infrastructure</h2>
                <p className="text-base text-grey-300 mb-8 leading-relaxed">
                    Access to live intelligence nodes requires Level 5 clearance. Enter your partner passcode to proceed.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter Passcode..."
                        className={`w-full bg-black/50 border ${error ? 'border-red-500/50 text-red-500' : 'border-grey-700/50 text-primary'} rounded-none px-4 py-3 text-center uppercase tracking-[0.2em] text-base focus:outline-none focus:border-primary/50 transition-colors`}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-grey-900 border border-grey-800 text-grey-400 hover:text-white hover:border-grey-600 px-4 py-3 text-base uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Authenticate"}
                    </button>
                </form>

                {error ? (
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-red-500/80 text-base uppercase tracking-widest mt-6"
                    >
                        Authentication Failed
                    </motion.p>
                ) : (
                    <button
                        onClick={() => navigate('/request-access')}
                        className="text-grey-600 hover:text-grey-400 text-[10px] uppercase tracking-[0.2em] mt-6 transition-colors"
                    >
                        Request Clearance →
                    </button>
                )}
            </motion.div>
        </div>
    );
}
