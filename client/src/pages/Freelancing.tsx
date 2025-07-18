import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Star, ArrowRight, Database, BarChart3, Cloud, Code, Globe, ExternalLink, Github } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import type { Project, Testimonial } from "@shared/schema";

export default function Freelancing() {
  const [activeCategory, setActiveCategory] = useState<"all" | "data" | "web">("all");
  
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", "freelance"],
    queryFn: async () => {
      const response = await fetch("/api/projects?category=freelance");
      if (!response.ok) throw new Error("Failed to fetch freelance projects");
      return response.json();
    },
  });

  // Helper function to determine if a project is data engineering
  const isDataEngineeringProject = (project: Project) => {
    const dataTechnologies = ["Python", "AWS", "Kafka", "Spark", "PySpark", "Airflow", "Snowflake", "PostgreSQL", "MongoDB", "Redshift", "Glue", "MLflow", "Kinesis", "Lambda", "Tableau"];
    return project.technologies.some(tech => dataTechnologies.includes(tech));
  };

  // Filter projects based on category
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    if (activeCategory === "all") return projects;
    if (activeCategory === "data") return projects.filter(isDataEngineeringProject);
    if (activeCategory === "web") return projects.filter(project => !isDataEngineeringProject(project));
    
    return projects;
  }, [projects, activeCategory]);

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
  });

  const services = [
    {
      title: "Data Pipeline Development",
      description: "Build scalable ETL/ELT pipelines using modern cloud technologies and best practices.",
      price: "Starting at $2,500",
      icon: Database,
      color: "bg-blue-600",
    },
    {
      title: "Analytics & BI Solutions",
      description: "Create comprehensive analytics dashboards and business intelligence solutions.",
      price: "Starting at $1,800",
      icon: BarChart3,
      color: "bg-emerald-600",
    },
    {
      title: "Cloud Migration",
      description: "Migrate your data infrastructure to cloud platforms for improved scalability.",
      price: "Starting at $3,000",
      icon: Cloud,
      color: "bg-amber-600",
    },
    {
      title: "Web Application Development",
      description: "Build modern, responsive web applications using React, Node.js, and cloud technologies.",
      price: "Starting at $2,000",
      icon: Code,
      color: "bg-purple-600",
    },
    {
      title: "Full-Stack Development",
      description: "End-to-end web development including frontend, backend, and database design.",
      price: "Starting at $3,500",
      icon: Globe,
      color: "bg-indigo-600",
    },
  ];

  const handleContactClick = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-stone-800 mb-4">Freelancing Services</h1>
            <p className="text-xl text-stone-600">Available for data engineering consulting and web development projects</p>
          </motion.div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-14 h-14 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className="text-2xl text-white" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-3">{service.title}</h3>
                <p className="text-stone-600 mb-3 text-sm">{service.description}</p>
                <div className="text-blue-600 font-medium text-sm">{service.price}</div>
              </motion.div>
            ))}
          </div>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handleContactClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 inline-flex items-center"
            >
              Get Started Today
              <ArrowRight className="ml-2" size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Freelance Projects */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Recent Freelance Projects</h2>
            <p className="text-xl text-stone-600">Successful projects delivered for clients worldwide - Data Engineering & Web Development</p>
          </motion.div>
          
          {/* Project Categories */}
          <div className="mb-12">
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
                onClick={() => setActiveCategory("data")}
                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                  activeCategory === "data"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                Data Engineering ({projects?.filter(isDataEngineeringProject).length || 0})
              </button>
              <button
                onClick={() => setActiveCategory("web")}
                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                  activeCategory === "web"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                Web Development ({projects?.filter(project => !isDataEngineeringProject(project)).length || 0})
              </button>
            </div>
          </div>
          
          {projectsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-stone-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-stone-200 rounded mb-4"></div>
                    <div className="h-3 bg-stone-200 rounded mb-2"></div>
                    <div className="h-3 bg-stone-200 rounded mb-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600 text-lg">
                No {activeCategory === "all" ? "" : activeCategory === "data" ? "data engineering" : "web development"} projects available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDataEngineeringProject(project) 
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {isDataEngineeringProject(project) ? "Data Engineering" : "Web Development"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-stone-800 mb-2">{project.title}</h3>
                    <p className="text-stone-600 mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-sm">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                      <div className="flex space-x-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 hover:text-stone-800 transition-colors"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 hover:text-stone-800 transition-colors"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Client Testimonials</h2>
            <p className="text-xl text-stone-600">What my clients say about working with me</p>
          </motion.div>
          
          {testimonialsLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-stone-50 p-6 rounded-xl shadow-md animate-pulse">
                  <div className="h-4 bg-stone-200 rounded mb-4"></div>
                  <div className="h-3 bg-stone-200 rounded mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded mb-4"></div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-stone-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-3 w-24 bg-stone-200 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-stone-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials?.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-stone-50 p-6 rounded-xl shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-amber-500 mr-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-stone-600 text-sm">{testimonial.rating}.0 rating</span>
                  </div>
                  <p className="text-stone-600 mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    {testimonial.avatarUrl && (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-stone-800">{testimonial.name}</div>
                      <div className="text-stone-600 text-sm">{testimonial.title}, {testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
