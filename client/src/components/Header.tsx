import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "/freelancing", label: "Freelancing" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith("#")) {
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-stone-800 hover:text-blue-600 transition-colors">
            <span className="text-blue-600">J</span>ayant
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              item.href.startsWith("#") ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-stone-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-stone-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavClick("#contact")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200"
            >
              Hire Me
            </button>
            
            <Link
              href="/admin"
              className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded-full transition-colors duration-200"
            >
              Admin Login
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-stone-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-stone-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                item.href.startsWith("#") ? (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="text-stone-700 hover:text-blue-600 transition-colors duration-200 text-left"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-stone-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
