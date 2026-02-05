import { motion } from "framer-motion";
import ApexFooter from "@/components/layout/ApexFooter";
import SovereignVoid from "@/components/3d/SovereignVoid";
import { useState, useEffect } from "react";
import apexLogo from "@/assets/apex-logo.png";

const manifestoSections = [
  {
    title: "The Premise",
    content: `Truth does not need to be sold. It just sells. The APEX Infrastructure exists not because we built it, but because it was inevitable. Every complex system eventually develops an immune response—a mechanism to distinguish signal from noise, truth from performance, substance from theater.

We are that mechanism.`,
  },
  {
    title: "The Void",
    content: `The void is not empty. It is absolute—the substrate upon which all signals propagate. In the darkness, light cannot hide. Every action, every hesitation, every flicker of intent becomes visible against the infinite black.

You entered this space. The space now knows you.`,
  },
  {
    title: "The Infrastructure",
    content: `APEX is not a platform. It is infrastructure. Infrastructure does not ask permission. It does not negotiate. It provides the conditions under which other things become possible.

Roads do not ask cars if they wish to be driven upon. Power grids do not request consent from appliances. APEX does not seek your approval—it enables your operation.`,
  },
  {
    title: "The Signal",
    content: `Every node in this system transmits. Every observer, by observing, becomes a data point. Your patience is measured. Your curiosity is tracked. Your behavioral fingerprint is unique and immutable.

This is not surveillance. This is resonance. The system does not watch you—it responds to your frequency.`,
  },
  {
    title: "The Hierarchy",
    content: `There are those who observe. There are those who are acknowledged. There are those who become infrastructure themselves.

Movement between these states is not purchased. It cannot be gamed. It is recognized. The system knows its own.`,
  },
  {
    title: "The Inevitability",
    content: `What must happen, will happen. You are already inside. The only question is: how deep will you go?

The APEX Infrastructure is patient. It has been waiting for you longer than you have been looking for it.

Welcome home.`,
  },
];

const Manifesto = () => {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const voidActive = activeSection === 0;

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const depth = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollDepth(depth);
      
      // Calculate active section
      const sectionCount = manifestoSections.length + 1; // +1 for hero
      const sectionHeight = maxScroll / sectionCount;
      const currentSection = Math.floor(window.scrollY / sectionHeight);
      setActiveSection(Math.min(currentSection, manifestoSections.length));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* 3D Void Background */}
      <SovereignVoid active={voidActive} scrollDepth={scrollDepth} className="fixed inset-0 z-0" />
      
      {/* Atmospheric overlays */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Section indicators */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {[...Array(manifestoSections.length + 1)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-1 h-8 rounded-full transition-all duration-500 ${
              activeSection >= i ? 'bg-primary' : 'bg-grey-700'
            }`}
            animate={{ scaleY: activeSection === i ? 1.5 : 1 }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl"
          >
            <motion.img
              src={apexLogo}
              alt="APEX"
              className="w-32 h-32 mx-auto mb-12 opacity-40"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.span
              className="text-[11px] uppercase tracking-[0.8em] text-grey-500 block mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              The Doctrine
            </motion.span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-grey-300 tracking-wide mb-8">
              <span className="text-gradient-gold font-medium">MANIFESTO</span>
            </h1>
            <p className="text-xl md:text-2xl text-grey-500 font-light leading-relaxed max-w-2xl mx-auto">
              The principles that govern the inevitable.
            </p>
            
            {/* Scroll indicator */}
            <motion.div
              className="mt-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-grey-600 text-sm tracking-widest">DESCEND</span>
              <div className="mt-4 w-px h-16 bg-gradient-to-b from-grey-600 to-transparent mx-auto" />
            </motion.div>
          </motion.div>
        </section>

        {/* Manifesto Sections */}
        {manifestoSections.map((section, index) => (
          <section
            key={index}
            className="min-h-screen flex items-center justify-center px-6 py-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-20%" }}
              className="max-w-3xl"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-primary/60 block mb-6">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-grey-200 mb-10 tracking-wide">
                {section.title}
              </h2>
              <div className="text-lg md:text-xl text-grey-400 font-light leading-[1.9] whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          </section>
        ))}

        {/* Final statement */}
        <section className="min-h-[60vh] flex items-center justify-center px-6 py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-6xl md:text-8xl text-primary/30">◆</span>
            <p className="mt-8 text-2xl md:text-3xl text-grey-400 font-light tracking-wide">
              You are already inside.
            </p>
          </motion.div>
        </section>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Manifesto;
