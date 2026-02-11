import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ApexSystemProvider, useApexSystem } from "@/contexts/ApexSystemContext";
import { OracleProvider, useOracle } from "@/contexts/OracleContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import Commons from "./pages/Commons";
import Manifesto from "./pages/Manifesto";
import Dashboard from "./pages/Dashboard";
import Nodes from "./pages/Nodes";
import NodeDetail from "./pages/NodeDetail";
import NodeFrame from "./pages/NodeFrame";
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
import SovereignInterface from "./components/oracle/SovereignInterface";
import ReturnToPortal from "./components/ReturnToPortal";

const queryClient = new QueryClient();

// Global Oracle and StatusOrb wrapper
function GlobalUI() {
  const { isOpen, closeOracle, openOracle } = useOracle();
  const { visitorId, status } = useApexSystem();

  return (
    <>
      {/* StatusOrb - persistent tier indicator */}
      <StatusOrb />

      {/* Return to Portal - persistent nav control */}
      <ReturnToPortal />

      {/* Sovereign Interface - Global Oracle */}
      <SovereignInterface
        isOpen={isOpen}
        onClose={closeOracle}
        visitorId={visitorId}
        accessLevel={status}
      />

      {/* Oracle Trigger Button - Fixed position */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={openOracle}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-black/90 border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:bg-primary/10 transition-all duration-500 group"
        style={{
          boxShadow: '0 0 40px hsl(42 95% 55% / 0.15)',
        }}
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

      {/* Keyboard hint tooltip */}
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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/commons" element={<Commons />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/nodes/:nodeId" element={<NodeDetail />} />
          <Route path="/node-frame/:id" element={<NodeFrame />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApexSystemProvider>
      <OracleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            {/* Global UI components */}
            <GlobalUI />
          </BrowserRouter>
        </TooltipProvider>
      </OracleProvider>
    </ApexSystemProvider>
  </QueryClientProvider>
);

export default App;
