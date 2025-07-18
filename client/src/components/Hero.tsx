import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Hero() {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-cream-50 to-stone-100 flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-6xl font-bold text-stone-800 leading-tight"
              >
                Hi, I'm <span className="text-blue-600">Jayant</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl lg:text-3xl text-stone-600 font-medium"
              >
                Data Engineer & Analytics Expert
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-stone-600 leading-relaxed"
              >
                Transforming raw data into actionable insights through modern data engineering practices. 
                Specialized in building scalable data pipelines and robust analytics solutions.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => handleScrollToSection("#projects")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                View My Work
              </button>
              <button
                onClick={() => handleScrollToSection("#contact")}
                className="border-2 border-stone-300 hover:border-blue-600 text-stone-700 hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                Get In Touch
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex space-x-6"
            >
              <a
                href="#"
                className="text-stone-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Linkedin size={32} />
              </a>
              <a
                href="#"
                className="text-stone-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Github size={32} />
              </a>
              <a
                href="#"
                className="text-stone-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Twitter size={32} />
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full opacity-20 animate-float"></div>
              <div className="relative bg-white rounded-full p-4 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"
                  alt="Jayant - Data Engineer"
                  className="w-full h-auto rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
