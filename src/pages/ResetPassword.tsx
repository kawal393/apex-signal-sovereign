import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowRight, Shield } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import apexLogo from "@/assets/apex-logo.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password Updated", description: "Your password has been reset successfully." });
      navigate("/partner");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ApexNav />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <motion.img
              src={apexLogo}
              alt="APEX"
              className="h-16 w-auto mx-auto mb-6 object-contain"
              animate={{ filter: ["drop-shadow(0 0 20px hsl(42 100% 55% / 0.3))", "drop-shadow(0 0 40px hsl(42 100% 55% / 0.5))", "drop-shadow(0 0 20px hsl(42 100% 55% / 0.3))"] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h1 className="text-2xl font-semibold text-foreground tracking-[0.15em] mb-2">
              RESET PASSWORD
            </h1>
            <p className="text-sm text-muted-foreground tracking-wide">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="glass-card p-8 rounded-lg border border-border/30 space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/60 border border-border/40 rounded-md px-4 py-3 text-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background/60 border border-border/40 rounded-md px-4 py-3 text-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading || password !== confirmPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-primary/10 border border-primary/40 rounded-md text-primary font-medium tracking-[0.15em] text-sm uppercase hover:bg-primary/20 hover:border-primary/60 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground/60 uppercase tracking-[0.2em]">
              <Shield className="w-3 h-3" />
              <span>256-bit encrypted · APEX Infrastructure © 2026</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
