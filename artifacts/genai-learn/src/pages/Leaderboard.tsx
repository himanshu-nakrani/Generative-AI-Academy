import { useState } from "react";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { Trophy, Flame, BookOpen, Medal, Crown, LogIn, Users, Search } from "lucide-react";

function rankBadge(rank: number) {
  if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
  return <span className="text-sm font-mono text-muted-foreground w-4 text-center">{rank}</span>;
}

export default function Leaderboard() {
  const { isSignedIn } = useUser();
  const { data, isLoading, error } = useGetLeaderboard({ limit: 50 });
  const [teamFilter, setTeamFilter] = useState("");

  // Filter by team name
  const entries = teamFilter.trim()
    ? (data?.entries ?? []).filter(e =>
        e.teamName?.toLowerCase().includes(teamFilter.toLowerCase())
      )
    : (data?.entries ?? []);

  // Unique teams
  const allTeams = [...new Set((data?.entries ?? []).map(e => e.teamName).filter(Boolean))] as string[];

  return (
    <main className="min-h-[calc(100dvh-56px)] bg-background px-4 py-8 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Top learners ranked by completed topics. Sign in to sync your progress and appear on the board.
          </p>
        </div>

        {/* Sign-in prompt */}
        {isSignedIn === false && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Join the leaderboard</p>
              <p className="text-xs text-muted-foreground">Sign in to sync your progress and compete with others</p>
            </div>
            <Link href="/sign-in">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </Link>
          </div>
        )}

        {/* Team filter */}
        {allTeams.length > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input
                value={teamFilter}
                onChange={e => setTeamFilter(e.target.value)}
                placeholder="Filter by team…"
                className="text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full"
              />
              {teamFilter && (
                <button onClick={() => setTeamFilter("")} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {allTeams.slice(0, 5).map(team => (
                <button
                  key={team}
                  onClick={() => setTeamFilter(teamFilter === team ? "" : team)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border transition-colors ${
                    teamFilter === team
                      ? "border-primary/40 bg-primary/8 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Users className="w-3 h-3" />{team}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-6 rounded-xl border border-border bg-card text-center">
            <p className="text-muted-foreground text-sm">Unable to load leaderboard. Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && data?.entries?.length === 0 && (
          <div className="p-12 rounded-xl border border-border bg-card text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No entries yet</h3>
            <p className="text-muted-foreground text-sm">Be the first to sync your progress and claim the top spot!</p>
          </div>
        )}

        {/* Filtered empty */}
        {!isLoading && !error && data && (data.entries?.length ?? 0) > 0 && entries.length === 0 && (
          <div className="p-8 rounded-xl border border-border bg-card text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No users match team "{teamFilter}"</p>
            <button onClick={() => setTeamFilter("")} className="text-xs text-primary hover:underline mt-2">Clear filter</button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && entries.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[48px_1fr_80px_80px] gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground text-center">#</span>
              <span className="text-xs font-semibold text-muted-foreground">User</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">Topics</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">Streak</span>
            </div>

            {/* Rows */}
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={`grid grid-cols-[48px_1fr_80px_80px] gap-2 px-4 py-3 border-b border-border last:border-0 items-center transition-colors ${
                  entry.isCurrentUser
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                {/* Rank */}
                <div className="flex justify-center">
                  {rankBadge(entry.rank)}
                </div>

                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  {entry.avatarUrl ? (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.displayName ?? "User"}
                      className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground flex-shrink-0">
                      {(entry.displayName?.[0] ?? "?").toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.displayName ?? "Anonymous"}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-primary font-normal">(you)</span>
                      )}
                    </p>
                    {entry.teamName && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Users className="w-3 h-3" />{entry.teamName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Topics */}
                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="font-semibold tabular-nums">{entry.completedCount}</span>
                </div>

                {/* Streak */}
                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span className="font-semibold tabular-nums">{entry.currentStreak}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current user rank callout (if not in top N) */}
        {isSignedIn === true && data?.currentUserRank && data.entries?.every((e) => !e.isCurrentUser) && (
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
            <p className="text-sm text-foreground">
              Your current rank: <span className="font-semibold text-primary">#{data.currentUserRank}</span>
            </p>
            <p className="text-xs text-muted-foreground">Keep learning to climb!</p>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-6 text-xs text-center text-muted-foreground">
          Rankings update each time you sync.{" "}
          {isSignedIn === true && (
            <Link href="/profile" className="text-primary hover:underline">Set your team name</Link>
          )} to compete with teammates.
        </p>
      </div>
    </main>
  );
}
