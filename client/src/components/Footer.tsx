import { Link, useLocation } from "wouter";
import { Linkedin, Github, Twitter } from "lucide-react";

export default function Footer() {
  const [location] = useLocation();
  
  const handleNavClick = (sectionId: string) => {
    // If we're not on home page, navigate to home first
    if (location !== "/") {
      window.location.href = "/" + sectionId;
      return;
    }
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-stone-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold mb-4">
              <span className="text-blue-400">J</span>ayant
            </div>
            <p className="text-stone-300 mb-4">
              Data Engineer specializing in building scalable data infrastructure and analytics solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/jayant-verma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/jayant-verma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com/jayant_verma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleNavClick("#home")}
                className="block text-stone-400 hover:text-white transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("#projects")}
                className="block text-stone-400 hover:text-white transition-colors duration-200"
              >
                Projects
              </button>
              <Link
                href="/freelancing"
                className="block text-stone-400 hover:text-white transition-colors duration-200"
              >
                Freelancing
              </Link>
              <button
                onClick={() => handleNavClick("#contact")}
                className="block text-stone-400 hover:text-white transition-colors duration-200"
              >
                Contact
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              <div className="text-stone-400">Data Pipeline Development</div>
              <div className="text-stone-400">Analytics & BI Solutions</div>
              <div className="text-stone-400">Cloud Migration</div>
              <div className="text-stone-400">ML Platform Development</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-stone-400 mb-4 md:mb-0">
              © 2024 Jayant. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => handleNavClick("#contact")}
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                Get in Touch
              </button>
              <Link
                href="/projects"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                View Portfolio
              </Link>
              <Link
                href="/admin"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
