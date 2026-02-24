import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Bounties from "./pages/Bounties";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimers from "./pages/Disclaimers";
import Footer from "./components/Footer";

type Page = "landing" | "bounties" | "terms" | "privacy" | "disclaimers";

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const p = window.location.pathname.replace(/^\//, "") || "landing";
    if (p === "bounties" || p === "terms" || p === "privacy" || p === "disclaimers") return p;
    return "landing";
  });

  const go = (p: Page) => {
    setPage(p);
    window.history.pushState({}, "", p === "landing" ? "/" : `/${p}`);
  };

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname.replace(/^\//, "") || "landing";
      const next: Page = path === "bounties" || path === "terms" || path === "privacy" || path === "disclaimers" ? path : "landing";
      setPage(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="min-h-screen bg-arena flex flex-col">
      <main className="flex-1">
        {page === "landing" && <Landing onNavigate={go} />}
        {page === "bounties" && <Bounties onNavigate={go} />}
        {page === "terms" && <Terms onNavigate={go} />}
        {page === "privacy" && <Privacy onNavigate={go} />}
        {page === "disclaimers" && <Disclaimers onNavigate={go} />}
      </main>
      <Footer onNavigate={go} />
    </div>
  );
}
