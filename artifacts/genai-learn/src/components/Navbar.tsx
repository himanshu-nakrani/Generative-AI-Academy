import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Menu, X, Flame, BarChart3, Network, Highlighter, Search,
  LogIn, LogOut, User, ChevronDown, Bookmark, Trophy,
} from "lucide-react";
import { useUser, useClerk, Show } from "@clerk/react";
import { topics } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useAchievements } from "@/context/AchievementsContext";

const navLinks = [
  { href: "/topics",         label: "Topics" },
  { href: "/learning-paths", label: "Learning Paths" },
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
        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-sm"
      >
        {user.imageUrl ? (
          <img src={user.imageUrl} alt={name} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
            {initials.toUpperCase() || <User className="w-3.5 h-3.5" />}
          </div>
        )}
        <span className="hidden sm:inline text-foreground font-medium max-w-[120px] truncate">{name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-lg shadow-md z-50 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className="p-1">
              <Link href="/progress" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  My Progress
                </div>
              </Link>
              <Link href="/achievements" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  Achievements
                </div>
              </Link>
              <Link href="/bookmarks" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                  Bookmarks
                </div>
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut(() => navigate("/"));
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted cursor-pointer transition-colors"
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
  const { completedCount, streak } = useApp();
  const { earnedCount, newlyEarned } = useAchievements();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-7 h-7 rounded-[5px] bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_hsl(45_66%_52%/0.35)]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1.5L11.5 6.5L6.5 11.5L1.5 6.5L6.5 1.5Z" stroke="hsl(214,22%,8%)" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="6.5" cy="6.5" r="1.5" fill="hsl(214,22%,8%)"/>
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              GenAI<span className="text-primary font-semibold"> Learn</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <Link key={href} href={href}
                  className={`px-3.5 py-1.5 rounded-md text-sm transition-colors ${
                    active ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}>
                  {label}
                </Link>
              );
            })}
            <Link href="/map"
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 ${
                location === "/map" ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}>
              <Network className="w-3.5 h-3.5" />Map
            </Link>
            <Link href="/notes"
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 ${
                location === "/notes" ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}>
              <Highlighter className="w-3.5 h-3.5" />Notes
            </Link>
            <Link href="/search"
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 ${
                location === "/search" ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}>
              <Search className="w-3.5 h-3.5" />Search
            </Link>
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

            {/* Achievements badge */}
            <Link href="/achievements" className="relative">
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                location === "/achievements" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80"
              }`}>
                <Trophy className="w-3 h-3" />
                {earnedCount}
              </span>
              {newlyEarned.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </Link>

            {/* Bookmarks */}
            <Link href="/bookmarks"
              className={`p-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 ${
                location === "/bookmarks" ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}>
              <Bookmark className="w-3.5 h-3.5" />
            </Link>

            {/* Auth */}
            <Show when="signed-in">
              <UserMenu />
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-foreground font-medium">
                <LogIn className="w-3.5 h-3.5" />Sign in
              </Link>
              <Link href="/topics"
                className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Start Learning
              </Link>
            </Show>
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-1 md:hidden">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-orange-500">
                <Flame className="w-3.5 h-3.5" />{streak}
              </span>
            )}
            <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-3 space-y-0.5">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                location === href ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/map" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              <Network className="w-4 h-4" />Concept Map
            </div>
          </Link>
          <Link href="/notes" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              <Highlighter className="w-4 h-4" />My Notes
            </div>
          </Link>
          <Link href="/search" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              <Search className="w-4 h-4" />Search
            </div>
          </Link>
          <Link href="/bookmarks" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              <Bookmark className="w-4 h-4" />Bookmarks
            </div>
          </Link>
          <Link href="/achievements" onClick={() => setMobileOpen(false)}>
            <div className="relative flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              <Trophy className="w-4 h-4" />Achievements
              {earnedCount > 0 && (
                <span className="ml-auto text-xs text-primary font-medium">{earnedCount}</span>
              )}
            </div>
          </Link>
          {completedCount > 0 && (
            <Link href="/progress" onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <BarChart3 className="w-4 h-4" />My Progress ({completedCount}/{topics.length})
              </div>
            </Link>
          )}
          <div className="pt-1 border-t border-border mt-1">
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                  <LogIn className="w-4 h-4" />Sign in
                </div>
              </Link>
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
      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
    >
      <LogOut className="w-4 h-4" />Sign out ({name})
    </button>
  );
}
