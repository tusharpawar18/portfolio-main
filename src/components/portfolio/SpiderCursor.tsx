import { useEffect, useRef, useState } from "react";

/**
 * Premium custom cursor:
 * - small dot follows pointer
 * - elastic ring scales on hover (subtle "web tension")
 * - on click → fast subtle web-shoot burst
 */
export function SpiderCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    };
    const click = (e: MouseEvent) => {
      const burst = document.createElement("div");
      burst.className = "web-burst";
      burst.style.left = `${e.clientX - 40}px`;
      burst.style.top = `${e.clientY - 40}px`;
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 500);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor='hover']"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);
    window.addEventListener("mouseover", over);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        const s = hover ? 1.6 : 1;
        ring.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${s})`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, [hover]);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border transition-[border-color,background] duration-300 ease-out"
        style={{
          borderColor: hover ? "oklch(0.82 0.14 200 / 0.7)" : "oklch(1 0 0 / 0.25)",
          background: hover ? "oklch(0.82 0.14 200 / 0.06)" : "transparent",
          mixBlendMode: "screen",
          willChange: "transform",
          transitionProperty: "transform, border-color, background",
          transitionTimingFunction: "cubic-bezier(.2,.9,.2,1.2)",
          transitionDuration: "260ms",
        }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--neon-red)", boxShadow: "0 0 6px var(--neon-red)" }}
      />
    </>
  );
}
