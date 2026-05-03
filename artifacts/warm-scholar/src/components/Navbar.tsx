import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Flame, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const [location] = useLocation();
  const { streak, completedCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/topics", label: "Topics" },
    { href: "/learning-paths", label: "Learning Paths" },
    { href: "/glossary", label: "Glossary" },
    { href: "/resources", label: "Resources" },
    { href: "/map", label: "Map" },
    { href: "/notes", label: "Notes" },
    { href: "/search", label: "Search" },
  ];

  return (
    <nav className="ws-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white text-lg leading-none">⬡</span>
              </div>
              <span className="ws-nav-logo font-serif text-lg font-bold tracking-wide">
                GenAI <span className="text-primary">Learn</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`ws-nav-link text-sm font-medium transition-colors ${
                  location.startsWith(link.href) ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side stats */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/progress" className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-bold">{streak}</span>
            </Link>
            <Link href="/progress" className="flex items-center gap-1.5 text-[#f5e6c8] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{completedCount} / 40</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#c8b08a] hover:text-[#c8882a] p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2c1f0e] border-t border-[#3a2a14]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.startsWith(link.href)
                    ? "text-[#c8882a] bg-white/5"
                    : "text-[#c8b08a] hover:text-[#c8882a] hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 px-3 py-3 border-t border-[#3a2a14] mt-2">
              <Link href="/progress" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{streak}</span>
              </Link>
              <Link href="/progress" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 text-[#f5e6c8] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{completedCount} / 40</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
