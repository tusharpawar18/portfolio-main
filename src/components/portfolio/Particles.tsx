import { useMemo } from "react";

export function Particles({ count = 30 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 10,
        dur: 8 + Math.random() * 12,
        color: i % 3 === 0 ? "var(--neon-red)" : i % 3 === 1 ? "var(--neon-cyan)" : "var(--neon-blue)",
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {parts.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `particle-float ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
