import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowRight, Shield } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import apexLogo from "@/assets/apex-logo.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  if (user) {
    navigate("/partner", { replace: true });
    return null;
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Email Required", description: "Enter your email address first.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: "Reset Email Sent", description: "Check your inbox for password reset instructions." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Access Granted", description: "Welcome back, Partner." });
        navigate("/partner");
      } else {
        if (password !== confirmPassword) {
          toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (!acceptTerms) {
          toast({ title: "Terms Required", description: "You must accept the Terms and Conditions.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Partner Registered", description: "Your APEX Partner ID has been generated." });
        navigate("/partner");
      }
    } catch (err: any) {
      toast({ title: "Access Denied", description: err.message, variant: "destructive" });
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
          {/* Logo */}
          <div className="text-center mb-12">
            <motion.img
              src={apexLogo}
              alt="APEX"
              className="h-16 w-auto mx-auto mb-6 object-contain"
              animate={{ filter: ["drop-shadow(0 0 20px hsl(42 100% 55% / 0.3))", "drop-shadow(0 0 40px hsl(42 100% 55% / 0.5))", "drop-shadow(0 0 20px hsl(42 100% 55% / 0.3))"] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h1 className="text-2xl font-semibold text-foreground tracking-[0.15em] mb-2">
              {isLogin ? "PARTNER ACCESS" : "BECOME A PARTNER"}
            </h1>
            <p className="text-sm text-muted-foreground tracking-wide">
              {isLogin ? "Enter your credentials to access the Partner Dashboard" : "Join 200+ organizations in the APEX network"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="glass-card p-8 rounded-lg border border-border/30 space-y-5">
              {!isLogin && (
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-background/60 border border-border/40 rounded-md px-4 py-3 text-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Your name or organization"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/60 border border-border/40 rounded-md px-4 py-3 text-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="partner@organization.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Password</label>
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

              {/* Confirm Password - Signup only */}
              {!isLogin && (
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-2">Confirm Password</label>
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
                    <p className="text-[10px] text-destructive mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              {/* Login extras */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border/40 accent-primary"
                    />
                    <span className="text-[10px] text-muted-foreground tracking-wide">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] text-primary/70 hover:text-primary tracking-wide transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms checkbox - Signup only */}
              {!isLogin && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-border/40 accent-primary mt-0.5"
                  />
                  <span className="text-[10px] text-muted-foreground tracking-wide leading-relaxed">
                    I accept the{" "}
                    <Link to="/terms" className="text-primary/70 hover:text-primary underline" target="_blank">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary/70 hover:text-primary underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-primary/10 border border-primary/40 rounded-md text-primary font-medium tracking-[0.15em] text-sm uppercase hover:bg-primary/20 hover:border-primary/60 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {isLogin ? "Access Dashboard" : "Generate Partner ID"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => { setIsLogin(!isLogin); setConfirmPassword(""); setAcceptTerms(false); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            >
              {isLogin ? "No account? Become a Partner →" : "Already a partner? Sign in →"}
            </button>
          </div>

          {/* Legal disclaimer */}
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

export default Auth;
