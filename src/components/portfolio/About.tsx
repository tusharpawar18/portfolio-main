import { motion } from "framer-motion";
import { Code2, GraduationCap, Briefcase, Award } from "lucide-react";

const items = [
  {
    icon: GraduationCap,
    color: "var(--neon-cyan)",
    title: "Education",
    text: "B.E. Computer Engineering · PCCoE Pune (2026). Honors in Deep Learning, Java Backend specialisation, Minor in Cloud Computing.",
  },
  {
    icon: Briefcase,
    color: "var(--neon-red)",
    title: "Experience",
    text: "Data Science Intern at Prodigy Info-Tech (Aug–Sep 2025). Worked on real-world ML tasks with Pandas, NumPy, Scikit-learn, Matplotlib.",
  },
  {
    icon: Code2,
    color: "var(--neon-blue)",
    title: "Focus",
    text: "Building scalable Java + Spring Boot backends and exploring Cloud + Deep Learning to solve analytical problems.",
  },
  {
    icon: Award,
    color: "var(--neon-cyan)",
    title: "Activities",
    text: "Smart India Hackathon · INNOHACK 2024 · ANVESHAN 2025 (CHAKAVA Treasure Hunt). Active on Codechef, HackerRank & LeetCode.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--neon-red)]">/ 01 — about</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Engineer in the <span className="text-gradient-neon">making.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            I'm Tushar Pawar — a Computer Engineering student from Pune with a passion for
            Java backend development, cloud, and data. I love turning real-world problems
            into clean, scalable code. Currently seeking an Internship.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group glass relative overflow-hidden rounded-2xl p-8 transition-all hover:-translate-y-2"
              style={{ "--c": it.color } as React.CSSProperties}
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `0 0 40px ${it.color}55, inset 0 0 40px ${it.color}22` }}
              />
              <div
                className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ background: `${it.color}15`, color: it.color, boxShadow: `0 0 20px ${it.color}55` }}
              >
                <it.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
