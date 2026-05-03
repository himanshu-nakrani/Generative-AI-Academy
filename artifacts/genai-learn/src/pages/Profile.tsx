import { useUser, useClerk, SignOutButton } from "@clerk/react";
import { Mail, LogOut, Calendar, Award, BookOpen, Flame } from "lucide-react";
import { Link } from "wouter";
import { useApp } from "@/context/AppContext";
import { useAchievements } from "@/context/AchievementsContext";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { completed, streak, bestStreak } = useApp();
  const { earnedCount } = useAchievements();
  const { bookmarkCount } = useBookmarks();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Not signed in</h1>
            <p className="text-muted-foreground mb-6">Sign in to view your profile and learning stats.</p>
            <Link href="/sign-in" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = user.firstName || user.username || "User";
  const email = user.primaryEmailAddress?.emailAddress || "No email";
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown";

  return (
    <main className="min-h-[calc(100dvh-56px)] bg-background px-4 py-8 sm:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={name} className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold border-2 border-primary">
                {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? name[1] ?? "")}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-foreground mb-1">{name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinDate}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Topics Completed</h3>
            </div>
            <p className="text-3xl font-semibold text-foreground">{completed.size}</p>
            <p className="text-xs text-muted-foreground mt-2">out of 40 total topics</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
            </div>
            <p className="text-3xl font-semibold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground mt-2">
              best: <span className="font-semibold text-foreground">{bestStreak}</span>
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Achievements</h3>
            </div>
            <p className="text-3xl font-semibold text-foreground">{earnedCount}</p>
            <p className="text-xs text-muted-foreground mt-2">out of 24 badges</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Bookmarks</h3>
            </div>
            <p className="text-3xl font-semibold text-foreground">{bookmarkCount}</p>
            <p className="text-xs text-muted-foreground mt-2">saved for later</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/progress">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <BarChart className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">My Progress</p>
                  <p className="text-xs text-muted-foreground">View learning stats</p>
                </div>
              </div>
            </Link>
            <Link href="/achievements">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <Award className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Achievements</p>
                  <p className="text-xs text-muted-foreground">View all badges</p>
                </div>
              </div>
            </Link>
            <Link href="/bookmarks">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <div>
                  <p className="font-medium text-foreground">Bookmarks</p>
                  <p className="text-xs text-muted-foreground">Saved reading list</p>
                </div>
              </div>
            </Link>
            <Link href="/">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Continue Learning</p>
                  <p className="text-xs text-muted-foreground">Back to home</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function BarChart({ className }: { className?: string }) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className={className}>
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );
}
