import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApexSystemProvider } from "@/contexts/ApexSystemContext";
import Index from "./pages/Index";
import Commons from "./pages/Commons";
import Manifesto from "./pages/Manifesto";
import Dashboard from "./pages/Dashboard";
import Nodes from "./pages/Nodes";
import NodeDetail from "./pages/NodeDetail";
import Infrastructure from "./pages/Infrastructure";
import RequestAccess from "./pages/RequestAccess";
import Disclaimers from "./pages/Disclaimers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Protocol from "./pages/Protocol";
import Ledger from "./pages/Ledger";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApexSystemProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/commons" element={<Commons />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nodes" element={<Nodes />} />
            <Route path="/nodes/:nodeId" element={<NodeDetail />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route path="/disclaimers" element={<Disclaimers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/protocol" element={<Protocol />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ApexSystemProvider>
  </QueryClientProvider>
);

export default App;
