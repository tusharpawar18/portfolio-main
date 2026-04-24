import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/portfolio/Loader";
import { SpiderCursor } from "@/components/portfolio/SpiderCursor";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";
import { SoundProvider } from "@/hooks/useSound";
import { SoundToggle } from "@/components/portfolio/SoundToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tushar Pawar — Java Backend Developer & Engineering Student" },
      { name: "description", content: "Portfolio of Tushar Pawar — Computer Engineering student at PCCoE Pune. Java, Spring Boot, Cloud, Deep Learning. Open to internships." },
      { property: "og:title", content: "Tushar Pawar — Java Backend Developer" },
      { property: "og:description", content: "Cinematic portfolio of a Pune-based developer specialising in Java, Spring Boot and Cloud Computing." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SoundProvider>
      <Loader />
      <SpiderCursor />
      <Navbar />
      <SoundToggle />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </SoundProvider>
  );
}
