import { motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 backdrop-blur-xl"
      style={{ background: "oklch(0.09 0.01 260 / 0.55)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-display text-sm font-bold tracking-[0.35em]">
          <span className="text-gradient-neon">TUSHAR</span>
          <span className="text-muted-foreground"> / DEV</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[var(--neon-red)] to-[var(--neon-cyan)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="group inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:scale-[1.03]"
          style={{ boxShadow: "var(--shadow-neon-red)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--neon-red)", boxShadow: "0 0 8px var(--neon-red)" }} />
          Hire Me
        </a>
      </div>
    </motion.header>
  );
}
