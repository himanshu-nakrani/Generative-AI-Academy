import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/react";
import {
  Mail, LogOut, Calendar, Award, BookOpen, Flame, Cloud, RefreshCw, Check,
  Trophy, Edit2, X, Users, Zap,
} from "lucide-react";
import { Link } from "wouter";
import { useApp } from "@/context/AppContext";
import { useAchievements } from "@/context/AchievementsContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSyncToServer } from "@/hooks/useSyncToServer";
import { useXP } from "@/hooks/useXP";
import { useGetMyProfile, useUpdateMyProfile } from "@workspace/api-client-react";

function BarChart({ className }: { className?: string }) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className={className}>
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );
}

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { completed, streak, bestStreak } = useApp();
  const { earnedCount } = useAchievements();
  const { bookmarkCount } = useBookmarks();
  const { syncNow, lastSync } = useSyncToServer();
  const { level, levelName, levelColor, totalXP, levelProgress, xpIntoLevel, xpForLevel } = useXP();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [editingTeam, setEditingTeam] = useState(false);
  const [teamInput, setTeamInput] = useState("");
  const [teamSaved, setTeamSaved] = useState(false);

  const { data: profile } = useGetMyProfile();
  const { mutate: updateProfile, isPending: savingTeam } = useUpdateMyProfile();

  useEffect(() => {
    if (profile?.displayName !== undefined) {
      setTeamInput(profile.teamName ?? "");
    }
  }, [profile]);

  const handleSync = async () => {
    setIsSyncing(true); setSyncDone(false);
    await syncNow();
    setIsSyncing(false); setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  };

  const handleSaveTeam = () => {
    updateProfile(
      { data: { teamName: teamInput.trim() || null } },
      {
        onSuccess: () => {
          setEditingTeam(false);
          setTeamSaved(true);
          setTimeout(() => setTeamSaved(false), 3000);
        },
      }
    );
  };

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
            <p className="text-muted-foreground mb-6">Sign in to view your profile and sync progress across devices.</p>
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
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  return (
    <main className="min-h-[calc(100dvh-56px)] bg-background px-4 py-8 sm:px-8">
      <div className="max-w-2xl mx-auto">

        {/* Header Card */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={name} className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold border-2 border-primary">
                {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? name[1] ?? "")}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-3xl font-semibold text-foreground">{name}</h1>
                <span className={`px-2 py-0.5 rounded-full bg-muted text-xs font-semibold ${levelColor}`}>
                  Lv {level} · {levelName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${email}`} className="hover:text-foreground transition-colors text-sm">{email}</a>
              </div>
              {/* Team name */}
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                {editingTeam ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={teamInput}
                      onChange={e => setTeamInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSaveTeam(); if (e.key === "Escape") setEditingTeam(false); }}
                      placeholder="Enter team name…"
                      maxLength={40}
                      className="text-sm px-2 py-0.5 rounded border border-border bg-background text-foreground w-44 focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTeam}
                      disabled={savingTeam}
                      className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                    >
                      {savingTeam ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => setEditingTeam(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {profile?.teamName
                        ? <span className="text-foreground font-medium">{profile.teamName}</span>
                        : <span className="italic">No team set</span>
                      }
                    </span>
                    <button
                      onClick={() => { setTeamInput(profile?.teamName ?? ""); setEditingTeam(true); }}
                      className="text-xs text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {teamSaved && <span className="text-xs text-emerald-500">✓ Saved</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors text-sm font-medium disabled:opacity-60"
                >
                  {syncDone
                    ? <><Check className="w-4 h-4" /> Synced!</>
                    : isSyncing
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Syncing...</>
                    : <><Cloud className="w-4 h-4" /> Sync Now</>
                  }
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
              {lastSync && (
                <p className="text-xs text-muted-foreground mt-2">Last synced: {lastSync.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* XP / Level Progress */}
        <div className="mb-6 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-sm">Level Progress</h3>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-muted ${levelColor}`}>
              Level {level} · {levelName}
            </span>
          </div>
          <div className="mb-1.5">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{xpIntoLevel.toLocaleString()} / {xpForLevel.toLocaleString()} XP</span>
            <span>{totalXP.toLocaleString()} total XP</span>
          </div>
          <Link href="/analytics">
            <p className="text-xs text-primary hover:underline mt-2">View full analytics →</p>
          </Link>
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
            <Link href="/analytics">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <Zap className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">XP, levels, insights</p>
                </div>
              </div>
            </Link>
            <Link href="/progress">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <BarChart className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">My Progress</p>
                  <p className="text-xs text-muted-foreground">View learning stats</p>
                </div>
              </div>
            </Link>
            <Link href="/leaderboard">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <Trophy className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Leaderboard</p>
                  <p className="text-xs text-muted-foreground">See top learners</p>
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
          </div>
        </div>

      </div>
    </main>
  );
}
