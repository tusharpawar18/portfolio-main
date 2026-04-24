import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useRef } from "react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

const projects = [
  {
    img: p1,
    title: "Rosy",
    spec: "Web App",
    desc: "Modern and clean web application built with React. Fully responsive and interactive.",
    tags: ["React", "TypeScript", "Tailwind"],
    accent: "var(--neon-red)",
    live: "https://basic-rosy.vercel.app",
    github: "#" // Add your GitHub link here if available
  },
  {
    img: p2,
    title: "Super AR Hub",
    spec: "Full Stack",
    desc: "Augmented Reality Hub with Eclipse integration. Data saved in MySQL with secure backend.",
    tags: ["React", "Node.js", "MySQL", "Eclipse"],
    accent: "var(--neon-cyan)",
    live: "#", // Update when live
    github: "#" // Add your GitHub link here
  },
  {
    img: p3,
    title: "Project 3",
    spec: "Coming Soon",
    desc: "Next big project in development. Will be revealed very soon. Stay tuned!",
    tags: ["Next.js", "TypeScript", "Backend"],
    accent: "var(--neon-blue)",
    live: "#",
    github: "#"
  },
];

function ShowroomCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * -8}deg) rotateX(${y * 8}deg) translateZ(8px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className="group relative w-[78vw] shrink-0 snap-center md:w-[460px]"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass relative overflow-hidden rounded-3xl transition-transform duration-300"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={p.img}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, oklch(0.08 0.01 260) 100%)` }} />

          {/* Dynamic light reflection */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at var(--mx,50%) var(--my,50%), ${p.accent}33, transparent 50%)`,
              mixBlendMode: "screen"
            }}
          />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: p.accent }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
            {p.spec}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl font-bold">{p.title}</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">0{i + 1}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${p.accent}, oklch(0.62 0.2 252))`,
                boxShadow: `0 10px 30px -10px ${p.accent}`
              }}
            >
              Live <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:border-white/30"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--neon-red)]">/ 02 — showroom</p>
            <h2 className="mt-3 font-display text-4xl font-black md:text-5xl">
              Selected <span className="text-gradient-neon">builds</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">Drag, scroll, hover — each project rotates under the spotlight.</p>
        </motion.div>
      </div>

      {/* Showroom rail */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-10 pt-6 md:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((p, i) => (
            <ShowroomCard key={p.title} p={p} i={i} />
          ))}
          <div className="w-1 shrink-0" />
        </div>
      </div>
    </section>
  );
}