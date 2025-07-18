import { Link } from "wouter";
import { Linkedin, Github, Twitter } from "lucide-react";

export default function Footer() {
  const handleNavClick = (sectionId: string) => {
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
                href="#"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
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
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
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
