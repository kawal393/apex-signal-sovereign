import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApexSystemProvider, useApexSystem } from "@/contexts/ApexSystemContext";
import { OracleProvider, useOracle } from "@/contexts/OracleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GeoProvider } from "@/contexts/GeoContext";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Index from "./pages/Index";
import Commons from "./pages/Commons";
import Manifesto from "./pages/Manifesto";
import Dashboard from "./pages/Dashboard";
import Nodes from "./pages/Nodes";
import NodeDetail from "./pages/NodeDetail";
import NDISWatchtower from "./pages/nodes/NDISWatchtower";
import MiningWatchtower from "./pages/nodes/MiningWatchtower";
// GhostProtocol and CorporateTranslator imports removed — dormant nodes
import Infrastructure from "./pages/Infrastructure";
import RequestAccess from "./pages/RequestAccess";
import Disclaimers from "./pages/Disclaimers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Protocol from "./pages/Protocol";
import Ledger from "./pages/Ledger";
import RequestVerdict from "./pages/RequestVerdict";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import StatusOrb from "./components/ui/StatusOrb";
import Vera from "./pages/Vera";
import SovereignInterface from "./components/oracle/SovereignInterface";
import ReturnToPortal from "./components/ReturnToPortal";
import PasscodeGate from "./components/auth/PasscodeGate";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import PartnerDashboard from "./pages/PartnerDashboard";
import JurisdictionBanner from "./components/layout/JurisdictionBanner";
import GeoConsentBanner from "./components/layout/GeoConsentBanner";

const queryClient = new QueryClient();

// Global Oracle and StatusOrb wrapper
function GlobalUI() {
  const { isOpen, closeOracle, openOracle } = useOracle();
  const { visitorId, status } = useApexSystem();

  return (
    <>
      <StatusOrb />
      <ReturnToPortal />
      <SovereignInterface isOpen={isOpen} onClose={closeOracle} visitorId={visitorId} accessLevel={status} />
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={openOracle}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-black/90 border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:bg-primary/10 transition-all duration-500 group"
        style={{ boxShadow: '0 0 40px hsl(42 95% 55% / 0.15)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Oracle (Press O)"
      >
        <MessageCircle className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
        <motion.span
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
      <motion.div
        className="fixed bottom-[100px] right-8 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 bg-black/80 px-2 py-1 rounded border border-grey-800/30">
          Press O
        </span>
      </motion.div>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GeoProvider>
        <ApexSystemProvider>
          <OracleProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <JurisdictionBanner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/commons" element={<Commons />} />
                  <Route path="/manifesto" element={<Manifesto />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nodes" element={<PasscodeGate><Nodes /></PasscodeGate>} />
                  <Route path="/nodes/:nodeId" element={<PasscodeGate><NodeDetail /></PasscodeGate>} />
                  <Route path="/ndis-watchtower" element={<NDISWatchtower />} />
                  <Route path="/mining-watchtower" element={<MiningWatchtower />} />
                  <Route path="/nodes/ndis-watchtower/view" element={<PasscodeGate><NDISWatchtower /></PasscodeGate>} />
                  {/* Corporate Translator and Ghost Protocol are dormant — routes removed */}
                  <Route path="/infrastructure" element={<Infrastructure />} />
                  <Route path="/request-access" element={<RequestAccess />} />
                  <Route path="/disclaimers" element={<Disclaimers />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/protocol" element={<Protocol />} />
                  <Route path="/ledger" element={<Ledger />} />
                  <Route path="/request-verdict" element={<RequestVerdict />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/vera" element={<Vera />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/partner" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <GlobalUI />
                <GeoConsentBanner />
              </BrowserRouter>
            </TooltipProvider>
          </OracleProvider>
        </ApexSystemProvider>
      </GeoProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
