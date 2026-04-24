import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import profile from "@/assets/profile-cinematic.jpg";
import car from "@/assets/hero-car.jpg";
import { useSound } from "@/hooks/useSound";

type Phase = "idle" | "boot" | "ignite" | "drive" | "reveal";

function GlitchLine({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="font-mono text-[11px] uppercase tracking-[0.45em] text-muted-foreground"
    >
      <span className="glitch" data-text={text}>{text}</span>
    </motion.div>
  );
}

function Tachometer({ active }: { active: boolean }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!active) return;
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
      }
      setPct(Math.floor(p));
    }, 60);
    return () => clearInterval(id);
  }, [active]);

  const angle = -120 + (pct / 100) * 240;

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle cx="60" cy="60" r="52" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="2" />
        <path
          d="M 20 90 A 52 52 0 1 1 100 90"
          fill="none"
          stroke="url(#g)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={220 - (pct / 100) * 220}
          style={{ transition: "stroke-dashoffset 60ms linear" }}
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="var(--neon-cyan)" />
            <stop offset="1" stopColor="var(--neon-red)" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="absolute left-1/2 top-1/2 h-12 w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rounded"
        style={{
          background: "var(--neon-red)",
          boxShadow: "0 0 10px var(--neon-red)",
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          transformOrigin: "50% 100%",
          transition: "transform 80ms linear"
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-mono text-2xl font-black" style={{ color: "var(--neon-cyan)" }}>
            {pct}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            RPM × 100
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== REALISTIC CAR GAME ====================
function NightDriveGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gameState = useRef({
    playerX: 0,
    speed: 12,
    maxSpeed: 28,
    roadZ: 0,
    curve: 0,
    curveTarget: 0,
    obstacles: [] as { x: number; z: number }[],
    trees: [] as { x: number; z: number }[],
    keys: {} as Record<string, boolean>,
  });

  const resetGame = useCallback(() => {
    const gs = gameState.current;
    gs.playerX = 0;
    gs.speed = 12;
    gs.roadZ = 0;
    gs.curve = 0;
    gs.curveTarget = 0;
    gs.obstacles = [];
    gs.trees = [];
    setSpeed(0);
    setDistance(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 960;
    canvas.height = 620;

    const gs = gameState.current;
    resetGame();

    let frame: number;

    const spawn = (isTree: boolean) => {
      const side = Math.random() > 0.5 ? 1 : -1;
      (isTree ? gs.trees : gs.obstacles).push({
        x: side * (isTree ? 240 : 65),
        z: 900 + Math.random() * 400,
      });
    };

    const loop = () => {
      const { playerX, speed, roadZ, curve, obstacles, trees } = gs;

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, 340);
      sky.addColorStop(0, "#0a001f");
      sky.addColorStop(1, "#1a0033");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, 340);

      // City glow
      ctx.fillStyle = "rgba(103,232,249,0.1)";
      ctx.fillRect(0, 130, canvas.width, 120);

      // Road
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 280, canvas.width, canvas.height - 280);

      // Road segments
      for (let i = 22; i >= 0; i--) {
        const z = (roadZ + i * 42) % 1000;
        const scale = 340 / (z + 340);
        const w = 580 * scale;
        const y = 280 + i * 15;

        ctx.fillStyle = i % 2 === 0 ? "#1a1a1a" : "#121212";
        ctx.fillRect(canvas.width / 2 - w / 2, y, w, 17);

        // Neon sides
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 6 * scale;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - w / 2, y + 8);
        ctx.lineTo(canvas.width / 2 + w / 2, y + 8);
        ctx.stroke();
      }

      // Curve
      gs.curveTarget = Math.sin(roadZ / 700) * 1.2;
      gs.curve = gs.curve * 0.9 + gs.curveTarget * 0.1;

      // Controls
      let steer = 0;
      if (gs.keys["ArrowLeft"] || gs.keys["a"] || gs.keys["A"]) steer -= 1;
      if (gs.keys["ArrowRight"] || gs.keys["d"] || gs.keys["D"]) steer += 1;

      gs.playerX += steer * speed * 0.25;
      gs.playerX *= 0.88; // momentum

      if (gs.keys["ArrowUp"] || gs.keys["w"] || gs.keys["W"]) {
        gs.speed = Math.min(gs.maxSpeed, gs.speed + 0.45);
      } else {
        gs.speed = Math.max(9, gs.speed * 0.95);
      }

      gs.roadZ += gs.speed * 3.4;

      setSpeed(Math.floor(gs.speed * 9));
      setDistance((d) => Math.floor(d + gs.speed * 0.22));

      // Spawn
      if (Math.random() < 0.055) spawn(false);
      if (Math.random() < 0.14) spawn(true);

      // Draw objects
      [...trees, ...obstacles]
        .sort((a, b) => b.z - a.z)
        .forEach((obj, idx) => {
          const scale = 340 / (obj.z + 340);
          const x = canvas.width / 2 + (obj.x + gs.curve * (obj.z / 50)) * scale * 2.2;
          const y = 280 + (900 - obj.z) * 0.42;

          if (obj.z < -100) return;

          if (trees.includes(obj)) {
            // Tree
            ctx.fillStyle = "#166534";
            ctx.fillRect(x - 22 * scale, y - 80 * scale, 44 * scale, 90 * scale);
          } else {
            // Opponent car
            ctx.fillStyle = "#b91c1c";
            ctx.fillRect(x - 45 * scale, y - 38 * scale, 90 * scale, 65 * scale);
          }

          // Collision
          if (obj.z < 160 && obj.z > 40 && Math.abs(obj.x - gs.playerX * 1.6) < 55) {
            setGameOver(true);
            if (distance > highScore) setHighScore(distance);
          }
        });

      // Player Car
      const carX = canvas.width / 2 + gs.playerX * 6;
      const carY = 445;

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.ellipse(carX + 10, carY + 55, 55, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(carX - 55, carY - 5);
      ctx.quadraticCurveTo(carX - 48, carY - 42, carX + 50, carY - 35);
      ctx.lineTo(carX + 52, carY + 45);
      ctx.lineTo(carX - 52, carY + 45);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#1e2937";
      ctx.beginPath();
      ctx.moveTo(carX - 38, carY - 28);
      ctx.lineTo(carX + 38, carY - 24);
      ctx.lineTo(carX + 29, carY + 12);
      ctx.lineTo(carX - 29, carY + 12);
      ctx.fill();

      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = 40;
      ctx.fillStyle = "#67e8f9";
      ctx.fillRect(carX - 48, carY + 32, 96, 11);
      ctx.shadowBlur = 0;

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    const handleKeyDown = (e: KeyboardEvent) => {
      gs.keys[e.key] = true;
      if (e.key === "Escape") onClose();
    };
    const handleKeyUp = (e: KeyboardEvent) => (gs.keys[e.key] = false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [distance, highScore, onClose, resetGame]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl border border-cyan-400/30 bg-zinc-950 p-6"
      >
        <div className="mb-4 flex justify-between text-sm font-mono">
          <div className="text-cyan-400 tracking-[3px]">NIGHT DRIVE</div>
          <div className="flex gap-8">
            <div>SPEED <span className="text-3xl font-black text-white">{speed}</span> km/h</div>
            <div>DIST <span className="text-3xl font-black text-pink-400">{distance}</span>m</div>
          </div>
          <button onClick={onClose} className="hover:text-white">ESC</button>
        </div>

        <canvas ref={canvasRef} className="rounded-2xl" />

        <div className="mt-3 text-center font-mono text-xs text-muted-foreground">
          ← →  STEER &nbsp;&nbsp; ↑ W  ACCELERATE
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 rounded-3xl">
            <div className="text-7xl mb-4">💥</div>
            <div className="text-5xl font-black text-red-500">CRASHED</div>
            <p className="mt-4 text-2xl">Distance: <span className="text-cyan-400">{distance}m</span></p>
            <button
              onClick={resetGame}
              className="mt-8 rounded-full bg-white px-12 py-5 text-black font-bold text-lg hover:scale-105 transition"
            >
              RESTART
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showGame, setShowGame] = useState(false);
  const { play, stop, isPlaying } = useSound();

  const start = () => {
    if (phase !== "idle") return;
    play("ignition");
    setPhase("boot");
    document.body.animate(
      [{ transform: "translate(0,0)" }, { transform: "translate(2px,-1px)" }, { transform: "translate(-2px,1px)" }, { transform: "translate(0,0)" }],
      { duration: 360, iterations: 2 }
    );
    setTimeout(() => setPhase("ignite"), 400);
    setTimeout(() => setPhase("drive"), 1800);
    setTimeout(() => setPhase("reveal"), 3400);
  };

  const lightsOn = phase !== "idle";

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom, oklch(0.13 0.02 260) 0%, oklch(0.06 0.005 260) 70%)" }} />
      <div className="absolute inset-0 bg-grid opacity-15" />

      <div className={`headlight ${lightsOn ? "on" : ""}`} style={{ left: "8%", top: "30%" }} />
      <div className={`headlight ${lightsOn ? "on" : ""}`} style={{ right: "8%", top: "30%" }} />

      <motion.img
        src={car}
        alt=""
        aria-hidden
        initial={false}
        animate={
          phase === "drive"
            ? { x: "120vw", filter: "blur(6px) brightness(1.1)" }
            : phase === "reveal"
            ? { x: "120vw", opacity: 0 }
            : { x: 0 }
        }
        transition={{ duration: phase === "drive" ? 1.6 : 0.6, ease: [0.7, 0, 0.3, 1] }}
        className="pointer-events-none absolute bottom-[12%] left-1/2 w-[90vw] max-w-[1100px] -translate-x-1/2 select-none"
        style={{ opacity: phase === "idle" ? 0.35 : 1 }}
      />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10 mx-auto max-w-2xl px-6 text-center">
            <div className="dash-scan relative mb-6 h-px w-full overflow-hidden bg-white/5" />
            <GlitchLine text="// ENGINE STARTED · SYSTEM ONLINE" />
            <h1 className="mt-5 text-balance font-display text-4xl font-black leading-[1.05] md:text-6xl">
              Performance <span className="text-gradient-neon">Engineer</span>
              <br />
              <span className="text-foreground/90">. . .</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground md:text-base">
              Hit ignition. The garage door opens, the engine wakes, and the driver steps out.
            </p>
            <button onClick={start} className="group relative mt-10 inline-flex items-center gap-3 rounded-full glass px-8 py-4 font-mono text-xs uppercase tracking-[0.3em]" style={{ boxShadow: "var(--shadow-neon-red)" }}>
              <span className="relative grid h-8 w-8 place-items-center rounded-full" style={{ background: "var(--neon-red)", boxShadow: "0 0 18px var(--neon-red)" }}>
                <span className="block h-2 w-2 rounded-full bg-white" />
              </span>
              Start Engine
            </button>
          </motion.div>
        )}

        {(phase === "boot" || phase === "ignite") && (
          <motion.div key="rpm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="relative z-10 grid place-items-center px-6 text-center">
            <Tachometer active={phase === "ignite"} />
            <div className="mt-5 font-mono text-xs uppercase tracking-[0.4em]" style={{ color: "var(--neon-red)" }}>
              ignition · sequence 01
            </div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative z-10 grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[auto,1fr] md:items-center">
            <motion.div initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0, y: 30 }} animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }} className="relative mx-auto">
              <div className="relative group">
                <div className="absolute -inset-8 rounded-[32px] opacity-60 blur-3xl" style={{ background: "var(--gradient-neon)" }} />
                <div className="absolute left-5 top-5 z-30 rounded-full border border-white/10 bg-black/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-xl">
                  ● // Live
                </div>
                <div className="relative overflow-hidden rounded-[30px] border border-cyan-400/20 bg-black/40 p-2 shadow-2xl" style={{ boxShadow: "0 0 40px rgba(0,255,255,.12)" }}>
                  <img src={profile} alt="Developer portrait" className="h-[420px] w-[340px] object-cover object-center rounded-[24px]" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-6 py-2 font-mono text-[10px] uppercase tracking-[0.35em] backdrop-blur-xl">
                    <span className="text-pink-400">Identity</span> · <span className="text-cyan-400">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-left">
              <GlitchLine text="// driver online" />
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-4 text-balance font-display text-4xl font-black leading-[1.05] md:text-6xl">
                Hi, I'm <span className="text-gradient-neon">Tushar Pawar</span>
                <br />
                Java Backend <span className="text-gradient-cyan">Engineer.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-5 max-w-xl text-base text-muted-foreground">
                Third-year Computer Engineering student at PCCoE Pune — Honors in Java Backend Development, Minor in Cloud Computing. I build scalable server-side apps.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-8 flex flex-wrap gap-4">
                <a href="/resume.pdf" download className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full glass px-7 py-3 text-xs font-bold uppercase tracking-[0.25em]" style={{ boxShadow: "var(--shadow-neon-red)" }}>
                  Download Resume
                </a>
                <a href="#projects" className="rounded-full border border-white/10 px-7 py-3 text-xs font-bold uppercase tracking-[0.25em]">
                  Enter Showroom →
                </a>

                <button
                  onClick={() => { play("click"); setShowGame(true); }}
                  className="group relative inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-black/60 px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:border-cyan-400 hover:bg-cyan-950 transition-all active:scale-95"
                >
                  🏎️ NIGHT DRIVE SIM
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGame && <NightDriveGame onClose={() => setShowGame(false)} />}
      </AnimatePresence>
    </section>
  );
}