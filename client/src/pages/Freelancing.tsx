import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowRight, Database, BarChart3, Cloud } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import type { Project, Testimonial } from "@shared/schema";

export default function Freelancing() {
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", "freelance"],
    queryFn: async () => {
      const response = await fetch("/api/projects?category=freelance");
      if (!response.ok) throw new Error("Failed to fetch freelance projects");
      return response.json();
    },
  });

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
            <p className="text-xl text-stone-600">Available for data engineering consulting and projects</p>
          </motion.div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center mb-6`}>
                  <service.icon className="text-2xl text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-4">{service.title}</h3>
                <p className="text-stone-600 mb-4">{service.description}</p>
                <div className="text-blue-600 font-medium">{service.price}</div>
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
            <p className="text-xl text-stone-600">Successful projects delivered for clients worldwide</p>
          </motion.div>
          
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects?.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
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
