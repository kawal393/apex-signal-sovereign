import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { ApexButton } from "@/components/ui/apex-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.06)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6 max-w-lg"
      >
        <motion.span
          className="text-primary text-4xl block mb-6"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ◆
        </motion.span>

        <h1 className="text-6xl md:text-7xl font-semibold text-foreground mb-4 tracking-wide">
          SIGNAL <span className="text-gradient-gold">LOST</span>
        </h1>

        <p className="text-grey-400 text-lg mb-3">
          This path does not resolve to a known coordinate.
        </p>
        <p className="text-grey-600 text-sm mb-10">
          The system remains operational. Return to the Portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <ApexButton variant="primary" size="lg" className="gap-2">
              <Home className="w-4 h-4" />
              Return to Portal
            </ApexButton>
          </Link>
          <Link to="/nodes">
            <ApexButton variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              View Nodes
            </ApexButton>
          </Link>
        </div>

        <div className="mt-12 text-grey-700 text-xs tracking-[0.2em] uppercase">
          Route: {location.pathname}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
