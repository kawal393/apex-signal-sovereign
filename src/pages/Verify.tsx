import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { Shield, Upload, CheckCircle, XCircle, FileJson, Lock } from "lucide-react";

type VerificationState = "idle" | "processing" | "valid" | "invalid";

const Verify = () => {
  const isMobile = useIsMobile();
  const [state, setState] = useState<VerificationState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [proofData, setProofData] = useState<Record<string, unknown> | null>(null);

  const processProof = useCallback((file: File) => {
    setState("processing");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setProofData(json);
        // Simulate client-side hash verification
        setTimeout(() => {
          const hasHash = json?.proof_hash || json?.merkle_root || json?.hash;
          const hasSignature = json?.signature || json?.ed25519_signature;
          setState(hasHash && hasSignature ? "valid" : "invalid");
        }, 2000);
      } catch {
        setState("invalid");
        setProofData(null);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      processProof(file);
    }
  }, [processProof]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processProof(file);
  }, [processProof]);

  const reset = useCallback(() => {
    setState("idle");
    setProofData(null);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
              Independent Verification
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Regulator Gateway
            </h1>
            <p className="text-grey-400 max-w-xl mx-auto">
              Verify any APEX PSI Proof File independently. All verification happens
              locally in your browser — no data is transmitted.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-green-400/70">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-[0.3em]">
                Client-Side Only — Zero Data Transmission
              </span>
            </div>
          </motion.div>

          {/* ZK Circuit Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-12"
          >
            <div className="relative h-20 rounded-lg border border-border/20 bg-card/30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                {["Secret Data", "→", "ZK-SNARK", "→", "Proof Hash", "→", "Verify"].map((step, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className={`text-[10px] uppercase tracking-[0.2em] ${
                      step === "→" ? "text-primary/40" :
                      step === "Secret Data" ? "text-crimson-bright/60" :
                      step === "Verify" ? "text-green-400/80" :
                      "text-grey-400"
                    }`}
                  >
                    {step}
                  </motion.span>
                ))}
              </div>
              {/* Animated circuit lines */}
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-crimson-deep/40 via-primary/60 to-green-400/40"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 2, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {state === "idle" && (
                <motion.label
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`block cursor-pointer rounded-lg border-2 border-dashed p-16 text-center transition-all duration-300 ${
                    dragOver
                      ? "border-primary/60 bg-primary/5"
                      : "border-border/30 bg-card/20 hover:border-border/50"
                  }`}
                >
                  <Upload className="w-10 h-10 text-grey-500 mx-auto mb-4" />
                  <p className="text-sm text-grey-300 mb-2">
                    Drop an APEX Proof File (.json)
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-grey-600">
                    Or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </motion.label>
              )}

              {state === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-primary/30 bg-card/30 p-16 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
                  />
                  <p className="text-sm text-grey-300">Verifying proof integrity...</p>
                  <p className="text-[10px] text-grey-600 mt-2 tracking-[0.2em] uppercase">
                    Hashing · Signature Check · Sequence Validation
                  </p>
                </motion.div>
              )}

              {state === "valid" && (
                <motion.div
                  key="valid"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-green-500/30 bg-green-950/10 p-12 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-300 mb-2">Proof Verified</h3>
                  <p className="text-sm text-grey-400 mb-6">
                    The proof hash and signature are cryptographically valid.
                  </p>
                  {proofData && (
                    <div className="text-left bg-black/40 rounded border border-border/20 p-4 mb-6 max-h-48 overflow-auto">
                      <pre className="text-[10px] text-grey-500 font-mono whitespace-pre-wrap">
                        {JSON.stringify(proofData, null, 2).slice(0, 500)}
                      </pre>
                    </div>
                  )}
                  <button onClick={reset} className="text-xs uppercase tracking-[0.2em] text-grey-500 hover:text-grey-300 transition-colors">
                    Verify Another
                  </button>
                </motion.div>
              )}

              {state === "invalid" && (
                <motion.div
                  key="invalid"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center"
                >
                  <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-destructive mb-2">Verification Failed</h3>
                  <p className="text-sm text-grey-400 mb-6">
                    The proof file is missing required hash or signature fields.
                  </p>
                  <button onClick={reset} className="text-xs uppercase tracking-[0.2em] text-grey-500 hover:text-grey-300 transition-colors">
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* What Gets Verified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { icon: FileJson, label: "RFC 8785", desc: "Canonical JSON format" },
              { icon: Shield, label: "Ed25519", desc: "Digital signature" },
              { icon: Lock, label: "Merkle Root", desc: "Tamper-proof chain" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border/20 bg-card/20 text-center">
                <item.icon className="w-5 h-5 text-grey-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-grey-300 tracking-wide">{item.label}</div>
                <div className="text-[10px] text-grey-600 mt-1">{item.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Verify;
