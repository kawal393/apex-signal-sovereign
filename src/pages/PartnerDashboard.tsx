import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGeo } from "@/contexts/GeoContext";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import RegulatoryFeed from "@/components/sections/RegulatoryFeed";
import { Copy, Check, Users, DollarSign, Clock, TrendingUp, Crown, Shield, Zap, Share2, Linkedin, Mail, MessageCircle, Code } from "lucide-react";

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

function getPartnerTier(createdAt: string): { tier: string; color: string } {
  const date = new Date(createdAt);
  if (date < new Date("2026-04-01")) return { tier: "Founder Archon", color: "text-primary" };
  if (date < new Date("2026-07-01")) return { tier: "Senior Archon", color: "text-blue-400" };
  return { tier: "Archon", color: "text-foreground/70" };
}

function BountyClock() {
  const [bounty, setBounty] = useState(1247850);
  const [partnersOnline, setPartnersOnline] = useState(() => Math.floor(Math.random() * 10) + 8);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounty(prev => prev + Math.floor(Math.random() * 21) + 5);
    }, Math.floor(Math.random() * 5000) + 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPartnersOnline(Math.floor(Math.random() * 10) + 8);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-8 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Total Bounties Distributed</div>
      <motion.div
        className="text-4xl md:text-5xl font-bold tabular-nums"
        style={{ background: "linear-gradient(135deg, hsl(42 95% 55%), hsl(42 80% 70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        key={bounty}
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        ${bounty.toLocaleString()}
      </motion.div>
      <div className="flex items-center gap-2 mt-3">
        <motion.span
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[10px] text-muted-foreground">{partnersOnline} partners online now</span>
      </div>
    </div>
  );
}

function SocialShareButtons({ referralLink }: { referralLink: string }) {
  const [embedCopied, setEmbedCopied] = useState(false);
  const shareText = encodeURIComponent("Join the APEX partner network — earn 50% commission on every referral.");
  const encodedLink = encodeURIComponent(referralLink);
  const embedCode = `<a href="${referralLink}" style="display:inline-block;padding:12px 24px;background:#d4a020;color:#000;font-weight:bold;border-radius:6px;text-decoration:none;">Join APEX — Earn 50%</a>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 rounded-lg border border-border/30">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-4 h-4 text-primary" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Share & Grow</span>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-background/60 border border-border/30 rounded-md text-[10px] uppercase tracking-wide text-foreground/70 hover:border-primary/30 hover:text-primary transition-all">
          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-background/60 border border-border/30 rounded-md text-[10px] uppercase tracking-wide text-foreground/70 hover:border-primary/30 hover:text-primary transition-all">
          𝕏 Twitter
        </a>
        <a href={`https://wa.me/?text=${shareText}%20${encodedLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-background/60 border border-border/30 rounded-md text-[10px] uppercase tracking-wide text-foreground/70 hover:border-primary/30 hover:text-primary transition-all">
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <a href={`mailto:?subject=Join%20APEX%20Partner%20Network&body=${shareText}%20${encodedLink}`} className="flex items-center gap-2 px-4 py-2 bg-background/60 border border-border/30 rounded-md text-[10px] uppercase tracking-wide text-foreground/70 hover:border-primary/30 hover:text-primary transition-all">
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Code className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="text-[9px] text-muted-foreground/50">Embed banner:</span>
        <button onClick={copyEmbed} className="text-[9px] text-primary/60 hover:text-primary transition-colors">
          {embedCopied ? "Copied!" : "Copy HTML"}
        </button>
      </div>
    </div>
  );
}

const PartnerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const geo = useGeo();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ leads: 0, pending: 0, paid: 0, earnings: 0 });

  const referralLink = `${window.location.origin}?ref=${profile?.partner_id || "APEX-000000"}`;
  const partnerTier = profile?.created_at ? getPartnerTier(profile.created_at) : { tier: "Archon", color: "text-foreground/70" };
  const partnerSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

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
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[10px] text-muted-foreground">Active</span>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${partnerTier.color}`}>{partnerTier.tier}</span>
                <span className="text-[10px] text-muted-foreground/50">Partner since {partnerSince}</span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground border border-border/30 px-4 py-2 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Bounty Clock + Partner ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <BountyClock />
          <div className="glass-card p-8 rounded-lg border border-border/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your Partner ID</span>
            </div>
            <div className="text-3xl font-mono font-bold text-primary tracking-wider">
              {profile?.partner_id || "APEX-······"}
            </div>
            <p className="text-sm text-muted-foreground mt-3">This is your unique identifier in the APEX network.</p>
            {(profile as any)?.passcode && (
              <div className="mt-4 p-3 bg-background/60 border border-primary/20 rounded-md">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-1">Your Restricted Access Passcode</span>
                <span className="text-xl font-mono font-bold text-primary tracking-[0.4em]">{(profile as any).passcode}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Commission + Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
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

          <div className="glass-card p-8 rounded-lg border border-border/30">
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
                className="px-5 py-3 bg-primary/10 border border-primary/40 rounded-md text-primary hover:bg-primary/20 transition-all duration-300 flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
              </motion.button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 tracking-wide">
              Share this link. When someone signs up and converts, you earn 50% commission automatically.
            </p>
          </div>
        </motion.div>

        {/* Social Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mb-10"
        >
          <SocialShareButtons referralLink={referralLink} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="glass-card p-6 rounded-lg border border-border/20 text-center hover:border-border/40 transition-all duration-500"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1 tabular-nums">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Regulatory Risk Feed + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Risk Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="glass-card p-8 rounded-lg border border-border/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Live Regulatory Risk Feed</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 ml-auto">{geo.country}</span>
            </div>
            <RegulatoryFeed filterByRegion={true} />
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
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
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ${
                    (entry as any).isUser
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-background/40 border border-border/10 hover:border-border/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-bold tabular-nums w-7 ${
                      i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                    }`}>#{i + 1}</span>
                    <span className={`text-sm font-medium ${(entry as any).isUser ? "text-primary" : "text-foreground/80"}`}>
                      {entry.initials}
                      {(entry as any).isUser && (
                        <span className="text-[9px] uppercase tracking-wider text-primary/70 ml-2">YOU</span>
                      )}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${(entry as any).isUser ? "text-primary" : "text-foreground/60"}`}>
                    ${entry.earnings.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Legal Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
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
