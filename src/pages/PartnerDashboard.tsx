import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { Copy, Check, Users, DollarSign, Clock, TrendingUp, Crown, Shield, Zap } from "lucide-react";

const fakeLeaderboard = [
  { initials: "A.K.", earnings: 12450, rank: 1 },
  { initials: "S.M.", earnings: 9800, rank: 2 },
  { initials: "R.T.", earnings: 7200, rank: 3 },
  { initials: "J.P.", earnings: 5100, rank: 5 },
  { initials: "L.C.", earnings: 4300, rank: 6 },
  { initials: "D.W.", earnings: 3800, rank: 7 },
  { initials: "N.B.", earnings: 2900, rank: 8 },
  { initials: "F.H.", earnings: 1700, rank: 9 },
];

const PartnerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ leads: 0, pending: 0, paid: 0, earnings: 0 });

  const referralLink = `${window.location.origin}?ref=${profile?.partner_id || "APEX-000000"}`;

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { data } = await supabase
        .from("referrals")
        .select("status, commission_amount")
        .eq("partner_user_id", user.id);
      if (data) {
        setStats({
          leads: data.length,
          pending: data.filter((r) => r.status === "pending").length,
          paid: data.filter((r) => r.status === "paid").length,
          earnings: data.reduce((sum, r) => sum + Number(r.commission_amount || 0), 0),
        });
      }
    };
    fetchStats();
  }, [user]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Copied", description: "Your referral link is ready to share." });
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: "Total Leads", value: stats.leads, icon: Users, color: "text-blue-400" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
    { label: "Converted", value: stats.paid, icon: Check, color: "text-green-400" },
    { label: "Earnings", value: `$${stats.earnings.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
  ];

  // Insert current user into leaderboard
  const userEntry = {
    initials: (profile?.display_name || "YOU").slice(0, 2).toUpperCase() + ".",
    earnings: stats.earnings,
    rank: 4,
    isUser: true,
  };
  const fullLeaderboard = [
    ...fakeLeaderboard.slice(0, 3),
    userEntry,
    ...fakeLeaderboard.slice(3),
  ];

  return (
    <div className="min-h-screen bg-background">
      <ApexNav />
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground block mb-2">Partner Dashboard</span>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide">
                Welcome, {profile?.display_name || "Partner"}
              </h1>
            </div>
            <button
              onClick={signOut}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground border border-border/30 px-4 py-2 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Partner ID + Commission Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          {/* Partner ID Card */}
          <div className="glass-card p-8 rounded-lg border border-border/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your Partner ID</span>
            </div>
            <div className="text-3xl font-mono font-bold text-primary tracking-wider">
              {profile?.partner_id || "APEX-······"}
            </div>
            <p className="text-sm text-muted-foreground mt-3">This is your unique identifier in the APEX network.</p>
          </div>

          {/* Commission Banner */}
          <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Commission Program</span>
              </div>
              <div className="text-5xl font-bold text-primary mb-2">50%</div>
              <p className="text-base text-foreground/80">Commission on every referral conversion</p>
              <p className="text-sm text-muted-foreground mt-1">No cap. No limits. Pure leverage.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </motion.div>

        {/* Referral Link Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="glass-card p-8 rounded-lg border border-border/30 mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your Referral Link</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-background/60 border border-border/40 rounded-md px-4 py-3 text-sm text-foreground/70 font-mono truncate">
              {referralLink}
            </div>
            <motion.button
              onClick={copyLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary/10 border border-primary/40 rounded-md text-primary hover:bg-primary/20 transition-all duration-300 flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
            </motion.button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 tracking-wide">
            Share this link. When someone signs up and converts, you earn 50% commission automatically.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-card p-6 rounded-lg border border-border/20 text-center hover:border-border/40 transition-all duration-500"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1 tabular-nums">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass-card p-8 rounded-lg border border-border/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-5 h-5 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Partner Leaderboard</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 ml-auto">Live Rankings</span>
          </div>
          <div className="space-y-2">
            {fullLeaderboard.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-md transition-all duration-300 ${
                  (entry as any).isUser
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-background/40 border border-border/10 hover:border-border/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold tabular-nums w-8 ${
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                  }`}>
                    #{i + 1}
                  </span>
                  <span className={`text-base font-medium ${(entry as any).isUser ? "text-primary" : "text-foreground/80"}`}>
                    {entry.initials}
                    {(entry as any).isUser && (
                      <span className="text-[9px] uppercase tracking-wider text-primary/70 ml-2">YOU</span>
                    )}
                  </span>
                </div>
                <span className={`text-base font-semibold tabular-nums ${(entry as any).isUser ? "text-primary" : "text-foreground/60"}`}>
                  ${entry.earnings.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legal Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
            Commission structure subject to APEX Partner Agreement. Earnings are calculated upon verified conversion. 
            APEX Infrastructure does not guarantee specific income levels. All partner activities must comply with applicable laws. 
            © 2026 APEX INTELLIGENCE EMPIRE. ABN: 71 672 237 795.
          </p>
        </motion.div>
      </main>
      <ApexFooter />
    </div>
  );
};

export default PartnerDashboard;
