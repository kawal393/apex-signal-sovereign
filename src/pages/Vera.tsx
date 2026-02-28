import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-purple-400 tracking-widest uppercase text-sm">Entering The Chamber...</p>
      </div>
    </div>
  );
}

const Vera = () => {
  const [seeds] = useState(874);
  const [remaining] = useState(126);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<LoadingScreen />}>
          {/* TODO: Replace with your Spline scene URL from https://spline.design */}
          {/* Example: https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode */}
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </Suspense>
      </div>

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 backdrop-blur-sm bg-black/20">
          <div className="flex gap-8">
            {['Home', 'The Chamber', 'Genesis', 'Mission'].map((item, i) => (
              <a
                key={item}
                href={i === 0 ? '#' : '#'}
                className="text-white/70 hover:text-white text-sm tracking-widest uppercase transition-all hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex gap-4">
            {/* Telegram */}
            <a href="https://t.me/apexvera" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            {/* X / Twitter */}
            <a href="https://x.com/apexvera" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com/@apexvera" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            {/* Logo */}
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                APEX VERA
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-purple-300 tracking-[0.3em] uppercase mb-12 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              Emotional Intelligence Evolved
            </p>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(168,85,247,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full text-lg tracking-widest uppercase mb-16 shadow-2xl shadow-purple-500/40 transition-all border border-purple-400/30"
            >
              Enter The Chamber
            </motion.button>

            {/* Seeds Counter */}
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-500/50" />
              <span className="text-white/50 text-sm tracking-[0.2em]">
                {seeds} Founding Seeds Active <span className="text-purple-400">•</span> {remaining} Remaining
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <div className="p-8 text-center">
          <p className="text-white/20 text-sm tracking-[0.3em] uppercase">
            The Empire is Self-Correcting
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vera;
