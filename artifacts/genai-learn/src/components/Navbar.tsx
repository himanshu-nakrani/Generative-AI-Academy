import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Sun, Moon, Flame, BarChart3 } from "lucide-react";
import { topics } from "@/data/topics";
import { useApp } from "@/context/AppContext";

const navLinks = [
  { href: "/topics",         label: "Topics" },
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/glossary",       label: "Glossary" },
  { href: "/resources",      label: "Resources" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggleDark, completedCount, streak } = useApp();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2v10M4 4l6 6M10 4l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              GenAI<span className="text-muted-foreground font-normal"> Learn</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <Link
                  key={href} href={href}
                  className={`px-3.5 py-1.5 rounded-md text-sm transition-colors ${
                    active ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-orange-500 tabular-nums">
                <Flame className="w-3.5 h-3.5" />{streak}
              </span>
            )}
            {completedCount > 0 && (
              <Link href="/progress">
                <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors tabular-nums px-2 py-0.5 rounded-full bg-muted">
                  <BarChart3 className="w-3 h-3" />
                  {completedCount}/{topics.length}
                </span>
              </Link>
            )}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/topics"
              className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Start Learning
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-orange-500">
                <Flame className="w-3.5 h-3.5" />{streak}
              </span>
            )}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-3 space-y-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href} href={href}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                location === href ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          {completedCount > 0 && (
            <Link href="/progress" onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <BarChart3 className="w-4 h-4" />
                My Progress ({completedCount}/{topics.length})
              </div>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
