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
    { href: "/github-projects", label: "GitHub" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith("#")) {
      // If we're not on home page, navigate to home first
      if (location !== "/") {
        window.location.href = "/" + href;
        return;
      }
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto h-full px-6">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="text-2xl font-bold text-stone-800 hover:text-blue-600 transition-colors">
            <span className="text-blue-600">J</span>ayant
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-lg md:hidden">
            <div className="container mx-auto px-6 py-4">
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
          </div>
        )}
      </div>
    </nav>
  );
}
