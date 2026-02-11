import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

export default function ReturnToPortal() {
  const location = useLocation();
  // Hide on gate page and commons
  if (location.pathname === "/" || location.pathname === "/commons") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed bottom-8 left-8 z-40"
    >
      <Link
        to="/commons"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/90 border border-grey-800/50 hover:border-primary/30 text-grey-500 hover:text-primary transition-all duration-300 backdrop-blur-xl"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-[0.2em]">Portal</span>
      </Link>
    </motion.div>
  );
}
