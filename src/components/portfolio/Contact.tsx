import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useSound } from "@/hooks/useSound";

const socials = [
  { Icon: Github, href: "https://github.com/tusharpawar18", color: "var(--neon-cyan)", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/tushar-pawar-60114632a", color: "var(--neon-blue)", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:tushar.pawar231@pccoepune.org", color: "var(--neon-red)", label: "Email" },
  { Icon: Phone, href: "tel:+918010158084", color: "var(--neon-red)", label: "Phone" },
];

export function Contact() {
  const [sent, setSent] = useState(false);
  const { play } = useSound();
  return (
    <section id="contact" className="relative py-32">
      <div className="absolute inset-0 bg-web opacity-40" />
      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--neon-red)]">/ 04 — contact</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Let's <span className="text-gradient-neon">build</span> something.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Open to internship opportunities in Java backend, cloud and data. Drop a line —
            I reply fast.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
            <a href="mailto:tushar.pawar231@pccoepune.org" className="hover:text-[var(--neon-cyan)]">tushar.pawar231@pccoepune.org</a>
            <span>·</span>
            <a href="tel:+918010158084" className="hover:text-[var(--neon-cyan)]">+91 80101 58084</a>
            <span>·</span>
            <span>Pune, India</span>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={(e) => {
            e.preventDefault();
            play("click");
            setSent(true);
            setTimeout(() => setSent(false), 3000);
          }}
          className="glass rounded-2xl p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { name: "name", label: "Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
            ].map((f) => (
              <div key={f.name} className="group relative">
                <input
                  required
                  type={f.type}
                  name={f.name}
                  placeholder=" "
                  className="peer w-full rounded-lg border border-border bg-background px-4 pb-2 pt-6 text-sm outline-none transition-all focus:border-[var(--neon-cyan)] focus:shadow-[0_0_20px_oklch(0.85_0.18_195_/_0.3)]"
                />
                <label className="pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[var(--neon-cyan)]">
                  {f.label}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-5 group relative">
            <textarea
              required
              name="message"
              rows={5}
              placeholder=" "
              className="peer w-full resize-none rounded-lg border border-border bg-background px-4 pb-2 pt-6 text-sm outline-none transition-all focus:border-[var(--neon-cyan)] focus:shadow-[0_0_20px_oklch(0.85_0.18_195_/_0.3)]"
            />
            <label className="pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[var(--neon-cyan)]">
              Message
            </label>
          </div>

          <button
            type="submit"
            onMouseEnter={() => play("hover")}
            className="group mt-6 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full glass px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] transition-transform hover:scale-[1.01]"
            style={{ boxShadow: "var(--shadow-neon-red)" }}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--neon-red)", boxShadow: "0 0 12px var(--neon-red)" }}>
              <span className="block h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            {sent ? "Transmission Sent" : (<><Send className="h-3.5 w-3.5" /> Send Message</>)}
          </button>
        </motion.form>

        <div className="mt-12 flex justify-center gap-5">
          {socials.map(({ Icon, href, color, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="group relative grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition-all hover:-translate-y-1"
              style={{ "--c": color } as React.CSSProperties}
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ boxShadow: `0 0 24px ${color}, inset 0 0 12px ${color}66` }}
              />
              <Icon className="h-5 w-5 transition-colors" style={{ color }} />
            </a>
          ))}
        </div>

        <p className="mt-12 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} — Tushar Pawar · Built in Pune
        </p>
      </div>
    </section>
  );
}
