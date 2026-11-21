import { About } from "@/components/About";
import { Banner, ClosingBanner } from "@/components/Banner";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Masthead } from "@/components/Masthead";
import { Projects } from "@/components/Projects";
import { SectionIndex } from "@/components/SectionIndex";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Masthead />
      <SectionIndex />

      <main id="main" tabIndex={-1}>
        <Banner />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <ClosingBanner />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
