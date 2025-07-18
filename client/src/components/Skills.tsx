import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Database, 
  Cloud, 
  Code, 
  GitBranch, 
  Server, 
  Zap,
  BarChart3,
  Snowflake,
  Globe,
  Cpu
} from "lucide-react";
import type { Skill } from "@shared/schema";

export default function Skills() {
  const { data: skills, isLoading, error } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    queryFn: async () => {
      const response = await fetch("/api/skills");
      if (!response.ok) throw new Error("Failed to fetch skills");
      return response.json();
    },
  });

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Code,
      Cloud,
      Database,
      GitBranch,
      Server,
      Zap,
      BarChart3,
      Snowflake,
      Globe,
      Cpu,
    };
    return icons[iconName] || Code;
  };

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Technical Expertise</h2>
            <p className="text-xl text-stone-600">Technologies and tools I work with daily</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-cream-50 p-6 rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-stone-200 rounded-lg mx-auto mb-4"></div>
                <div className="h-4 bg-stone-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Technical Expertise</h2>
            <p className="text-xl text-red-600">Failed to load skills. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Technical Expertise</h2>
          <p className="text-xl text-stone-600">Technologies and tools I work with daily</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8"
        >
          {skills?.map((skill, index) => {
            const IconComponent = getIcon(skill.icon);
            return (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                className="bg-cream-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-200 text-center group"
              >
                <div className={`w-12 h-12 ${skill.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="text-2xl text-white" size={24} />
                </div>
                <h3 className="font-semibold text-stone-800">{skill.name}</h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
