import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) { p = 100; clearInterval(id); setTimeout(() => setDone(true), 400); }
      setPct(Math.floor(p));
    }, 120);
    return () => clearInterval(id);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-background transition-opacity duration-500"
         style={{ opacity: pct === 100 ? 0 : 1 }}>
      <div className="bg-grid absolute inset-0 opacity-15" />
      <div className="relative w-80 text-center">
        <div className="font-display text-2xl font-black tracking-[0.2em] text-foreground/90">
          SYSTEM<span className="text-gradient-neon"> BOOTING</span>
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          dashboard online
        </div>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, var(--neon-red), var(--neon-cyan))",
              boxShadow: "0 0 12px var(--neon-red)",
            }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>RPM</span><span style={{ color: "var(--neon-cyan)" }}>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
