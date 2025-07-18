import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DynamicSection from "@/components/DynamicSection";
import ProjectCard from "@/components/ProjectCard";
import type { WebsiteSection, Project } from "@shared/schema";

export default function Freelancing() {
  // Fetch website sections
  const { data: sections } = useQuery<WebsiteSection[]>({
    queryKey: ["/api/website-sections"],
    queryFn: async () => {
      const response = await fetch("/api/website-sections");
      if (!response.ok) throw new Error("Failed to fetch website sections");
      return response.json();
    }
  });

  // Fetch freelance projects
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects", "freelance"],
    queryFn: async () => {
      const response = await fetch("/api/projects?category=freelance");
      if (!response.ok) throw new Error("Failed to fetch freelance projects");
      return response.json();
    }
  });

  // Filter and sort sections for the freelancing page
  const freelanceSections = sections?.filter(section => 
    section.isActive && section.targetPage === 'freelance'
  ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        {/* Render dynamic sections */}
        {freelanceSections?.map(section => (
          <DynamicSection key={section.id} section={section} />
        ))}

        {/* Render freelance projects */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-stone-800 mb-12 text-center">Freelance Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects?.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
