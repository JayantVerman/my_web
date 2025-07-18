import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id ? parseInt(params.id) : 0;

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-stone-200 rounded w-1/4 mb-8"></div>
              <div className="h-12 bg-stone-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-stone-200 rounded mb-8"></div>
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-4 bg-stone-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-stone-800 mb-4">Project Not Found</h1>
              <p className="text-xl text-stone-600 mb-8">The project you're looking for doesn't exist.</p>
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h1 className="text-4xl font-bold text-stone-800 mb-4">{project.title}</h1>
                <p className="text-xl text-stone-600 mb-8">{project.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center text-stone-600">
                    <Calendar className="mr-2" size={16} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-stone-600">
                    <Tag className="mr-2" size={16} />
                    <span className="capitalize">{project.category}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 mb-8">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-stone-800 hover:bg-stone-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Github className="mr-2" size={20} />
                      View Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <ExternalLink className="mr-2" size={20} />
                      Live Demo
                    </a>
                  )}
                </div>
                
                {project.longDescription && (
                  <div className="prose max-w-none">
                    <h3 className="text-2xl font-semibold text-stone-800 mb-4">Project Details</h3>
                    <div className="text-stone-600 leading-relaxed whitespace-pre-line">
                      {project.longDescription}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                {project.imageUrl && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto rounded-xl shadow-xl"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
