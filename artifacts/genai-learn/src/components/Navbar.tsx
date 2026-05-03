import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Menu, X, Flame, BarChart3, Search,
  LogIn, LogOut, User, ChevronDown, Bookmark, Trophy,
  Sun, Moon, Command,
} from "lucide-react";
import { useUser, useClerk, Show } from "@clerk/react";
import { topics } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useAchievements } from "@/context/AchievementsContext";
import { useXP } from "@/hooks/useXP";

const navLinks = [
  { href: "/topics",         label: "Topics" },
  { href: "/learning-paths", label: "Paths" },
  { href: "/glossary",       label: "Glossary" },
  { href: "/resources",      label: "Resources" },
];

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  if (!user) return null;

  const name = user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User";
  const initials = (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? name[1] ?? "");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-muted transition-colors text-sm"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`User menu for ${name}`}
      >
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium" aria-hidden="true">
            {initials.toUpperCase() || <User className="w-3.5 h-3.5" />}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div 
            className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            role="menu"
            aria-label="User menu"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className="p-1.5">
              <Link href="/progress" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  Progress
                </div>
              </Link>
              <Link href="/streaks" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <Flame className="w-4 h-4 text-muted-foreground" />
                  Streaks
                </div>
              </Link>
              <Link href="/achievements" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  Achievements
                </div>
              </Link>
              <Link href="/bookmarks" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                  Bookmarks
                </div>
              </Link>
              <div className="my-1.5 border-t border-border" />
              <button
                onClick={() => {
                  setOpen(false);
                  signOut(() => navigate("/"));
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { completedCount, streak, dark, toggleDark } = useApp();
  const { earnedCount, newlyEarned } = useAchievements();
  const { level } = useXP();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2L12 7L7 12L2 7L7 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-primary-foreground"/>
                <circle cx="7" cy="7" r="1.5" fill="currentColor" className="text-primary-foreground"/>
              </svg>
            </div>
            <span className="font-semibold text-foreground tracking-tight">
              GenAI Academy
            </span>
          </Link>

          {/* Desktop nav - center */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <Link key={href} href={href}
                  aria-current={active ? "page" : undefined}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active 
                      ? "text-foreground bg-muted" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search trigger */}
            <Link href="/search">
              <button 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground"
                aria-label="Search topics (Command+K)"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background text-[11px] font-mono text-muted-foreground border border-border" aria-hidden="true">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>
            </Link>

            {/* Stats pills */}
            {streak > 0 && (
              <span 
                className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30"
                aria-label={`${streak} day learning streak`}
                role="status"
              >
                <Flame className="w-3.5 h-3.5" aria-hidden="true" />{streak}
              </span>
            )}
            
            {completedCount > 0 && (
              <Link href="/progress" aria-label={`Progress: ${completedCount} of ${topics.length} topics completed`}>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80">
                  <BarChart3 className="w-3 h-3" aria-hidden="true" />
                  {completedCount}/{topics.length}
                </span>
              </Link>
            )}

            {/* Achievements */}
            <Link href="/achievements" className="relative" aria-label={`Achievements: ${earnedCount} earned${newlyEarned.length > 0 ? `, ${newlyEarned.length} new` : ''}`}>
              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${
                location === "/achievements" 
                  ? "bg-accent/10 text-accent" 
                  : "text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80"
              }`}>
                <Trophy className="w-3 h-3" aria-hidden="true" />
                {earnedCount}
              </span>
              {newlyEarned.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={dark}
            >
              {dark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
            </button>

            {/* Auth */}
            <Show when="signed-in">
              <UserMenu />
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in"
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/topics"
                className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </Show>
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-2 md:hidden">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-orange-600 dark:text-orange-400">
                <Flame className="w-3.5 h-3.5" />{streak}
              </span>
            )}
            <button 
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4">
          <div className="space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location === href 
                    ? "text-foreground bg-muted" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <Search className="w-4 h-4" />Search
              </div>
            </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border space-y-1">
            <Link href="/bookmarks" onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <Bookmark className="w-4 h-4" />Bookmarks
              </div>
            </Link>
            <Link href="/achievements" onClick={() => setMobileOpen(false)}>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />Achievements
                </span>
                {earnedCount > 0 && (
                  <span className="text-xs text-accent font-medium">{earnedCount}</span>
                )}
              </div>
            </Link>
            {completedCount > 0 && (
              <Link href="/progress" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />Progress
                  </span>
                  <span className="text-xs text-muted-foreground">{completedCount}/{topics.length}</span>
                </div>
              </Link>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <Show when="signed-out">
              <div className="flex gap-3">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-3 rounded-xl text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors">
                    Sign in
                  </button>
                </Link>
                <Link href="/topics" onClick={() => setMobileOpen(false)} className="flex-1">
                  <button className="w-full py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    Get Started
                  </button>
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <MobileSignOut onClose={() => setMobileOpen(false)} />
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileSignOut({ onClose }: { onClose: () => void }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [, navigate] = useLocation();

  if (!user) return null;
  const name = user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User";

  return (
    <button
      onClick={() => { onClose(); signOut(() => navigate("/")); }}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors"
    >
      <LogOut className="w-4 h-4" />Sign out ({name})
    </button>
  );
}
