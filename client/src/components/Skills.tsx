import { motion } from "framer-motion";
import { 
  Database, 
  Cloud, 
  Code, 
  GitBranch, 
  Server, 
  Zap,
  BarChart3,
  Snowflake
} from "lucide-react";

export default function Skills() {
  const skills = [
    { name: "Python", icon: Code, color: "bg-blue-600" },
    { name: "AWS", icon: Cloud, color: "bg-amber-500" },
    { name: "Spark SQL", icon: Database, color: "bg-emerald-500" },
    { name: "PySpark", icon: Zap, color: "bg-red-500" },
    { name: "PostgreSQL", icon: Server, color: "bg-blue-700" },
    { name: "MongoDB", icon: Database, color: "bg-green-600" },
    { name: "Snowflake", icon: Snowflake, color: "bg-blue-400" },
    { name: "Git", icon: GitBranch, color: "bg-gray-800" },
  ];

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
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              className="bg-cream-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className={`w-12 h-12 ${skill.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <skill.icon className="text-2xl text-white" size={24} />
              </div>
              <h3 className="font-semibold text-stone-800">{skill.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
