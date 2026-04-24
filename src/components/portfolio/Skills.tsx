import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "Java / Spring Boot", level: 92 },
  { name: "Python", level: 88 },
  { name: "C / C++", level: 85 },
  { name: "SQL / MySQL", level: 86 },
  { name: "HTML / CSS", level: 90 },
  { name: "Cloud Computing", level: 78 },
];

function Gauge({ value, label, active }: { value: number; label: string; active: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  const angle = -120 + (v / 100) * 240;
  return (
    <div className="glass relative flex flex-col items-center rounded-2xl p-6">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(1 0 0 / 0.06)" strokeWidth="10" />
          <path
            d="M 22 92 A 50 50 0 1 1 98 92"
            fill="none"
            stroke="url(#sg)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset={220 - (v / 100) * 220}
          />
          <defs>
            <linearGradient id="sg" x1="0" x2="1">
              <stop offset="0" stopColor="var(--neon-cyan)" />
              <stop offset="0.6" stopColor="var(--neon-blue)" />
              <stop offset="1" stopColor="var(--neon-red)" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className="absolute left-1/2 top-1/2 h-14 w-[2px] rounded"
          style={{
            background: "var(--neon-red)",
            boxShadow: "0 0 10px var(--neon-red)",
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            transformOrigin: "50% 100%",
            transition: "transform 60ms linear",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-display text-2xl font-black text-foreground">{v}</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>
      <div className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-foreground/80">{label}</div>
    </div>
  );
}

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="skills" className="relative py-32">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--neon-cyan)]">/ 03 — dashboard</p>
            <h2 className="mt-3 font-display text-4xl font-black md:text-5xl">
              Performance <span className="text-gradient-neon">readout</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Live telemetry from the cockpit — each gauge calibrated against years of shipping production UIs.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Gauge value={s.level} label={s.name} active={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
