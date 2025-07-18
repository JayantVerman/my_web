import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import DynamicSection from "@/components/DynamicSection";
import type { WebsiteSection } from "@shared/schema";

export default function Home() {
  const { data: sections } = useQuery<WebsiteSection[]>({
    queryKey: ["/api/website-sections"],
    queryFn: async () => {
      const response = await fetch("/api/website-sections");
      if (!response.ok) throw new Error("Failed to fetch website sections");
      return response.json();
    }
  });

  // Filter and sort sections for the home page
  const homeSections = sections?.filter(section => 
    section.isActive && section.targetPage === 'regular'
  ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Skills />
      <Projects />
      {homeSections?.map(section => (
        <DynamicSection key={section.id} section={section} />
      ))}
      <Contact />
      <Footer />
    </div>
  );
}
