import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@shared/schema";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<"all" | "regular" | "freelance">("all");
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects?.filter(project => {
    if (activeCategory === "all") return true;
    return project.category === activeCategory;
  }) || [];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 mt-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-5xl font-bold text-stone-800 mb-4">All Projects</h1>
            <p className="text-xl text-stone-600">
              Comprehensive portfolio of data engineering and web development projects
            </p>
          </motion.div>
          
          {/* Category Filter */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-3 rounded-full transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              All Projects ({projects?.length || 0})
            </button>
            <button
              onClick={() => setActiveCategory("regular")}
              className={`px-6 py-3 rounded-full transition-all duration-200 ${
                activeCategory === "regular"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              Portfolio ({projects?.filter(p => p.category === "regular").length || 0})
            </button>
            <button
              onClick={() => setActiveCategory("freelance")}
              className={`px-6 py-3 rounded-full transition-all duration-200 ${
                activeCategory === "freelance"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              Freelance ({projects?.filter(p => p.category === "freelance").length || 0})
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600 text-lg">
                No {activeCategory === "all" ? "" : activeCategory} projects found.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}