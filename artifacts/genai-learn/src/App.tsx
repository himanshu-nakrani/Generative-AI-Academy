import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useClerk, ClerkLoading, ClerkLoaded } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { PrefsProvider } from "@/context/PrefsContext";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Topics from "@/pages/Topics";
import TopicDetail from "@/pages/TopicDetail";
import LearningPaths from "@/pages/LearningPaths";
import Resources from "@/pages/Resources";
import Glossary from "@/pages/Glossary";
import Progress from "@/pages/Progress";
import Map from "@/pages/Map";
import Notes from "@/pages/Notes";
import Quiz from "@/pages/Quiz";
import Search from "@/pages/Search";
import NotFound from "@/pages/not-found";
import Achievements from "@/pages/Achievements";
import Bookmarks from "@/pages/Bookmarks";
import Profile from "@/pages/Profile";
import Streaks from "@/pages/Streaks";
import QuizStats from "@/pages/QuizStats";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { AchievementsProvider } from "@/context/AchievementsContext";
import { AchievementToastManager } from "@/components/AchievementToast";
import { SyncProvider } from "@/components/SyncProvider";
import Leaderboard from "@/pages/Leaderboard";
import Analytics from "@/pages/Analytics";

const queryClient = new QueryClient();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// Only use proxy in production (set automatically by deployment system)
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL as string | undefined || undefined;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "top" as const,
  },
  variables: {
    colorPrimary: "hsl(45, 66%, 52%)",
    colorForeground: "hsl(240, 7%, 92%)",
    colorMutedForeground: "hsl(240, 4%, 62%)",
    colorDanger: "hsl(0, 68%, 58%)",
    colorBackground: "hsl(214, 22%, 8%)",
    colorInput: "hsl(216, 32%, 24%)",
    colorInputForeground: "hsl(240, 7%, 92%)",
    colorNeutral: "hsl(240, 4%, 55%)",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "0.375rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-semibold",
    socialButtonsBlockButtonText: "font-medium",
    formFieldLabel: "font-medium text-sm",
    footerActionLink: "font-medium",
    logoBox: "flex justify-center mb-2",
    logoImage: "w-12 h-12",
    formButtonPrimary: "font-medium",
    formFieldRow: "mb-4",
    main: "px-8 py-6",
  },
};

function AuthPageWrapper({ children, subtitle }: { children: React.ReactNode; subtitle: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-[440px]">
        <ClerkLoading>
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          {children}
        </ClerkLoaded>
      </div>
    </div>
  );
}

function SignInPage() {
  return (
    <AuthPageWrapper subtitle="Sign in to sync your progress across devices">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/`}
        appearance={clerkAppearance}
      />
      <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-muted-foreground text-center">
          💡 <strong>Tip:</strong> Use Google or GitHub OAuth above for instant signup with one click
        </p>
      </div>
    </AuthPageWrapper>
  );
}

function SignUpPage() {
  return (
    <AuthPageWrapper subtitle="Create an account to save your progress">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={`${basePath}/`}
        appearance={clerkAppearance}
      />
      <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-xs text-muted-foreground text-center">
          🚀 <strong>Fast signup:</strong> Google or GitHub above — takes 10 seconds!
        </p>
      </div>
    </AuthPageWrapper>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <Navbar />
      <KeyboardShortcutsModal />
      <main id="main-content" tabIndex={-1}>
        <Switch>
          <Route path="/"               component={Home} />
          <Route path="/topics"         component={Topics} />
          <Route path="/topic/:slug"    component={TopicDetail} />
          <Route path="/learning-paths" component={LearningPaths} />
          <Route path="/resources"      component={Resources} />
          <Route path="/glossary"       component={Glossary} />
          <Route path="/progress"       component={Progress} />
          <Route path="/map"            component={Map} />
          <Route path="/notes"          component={Notes} />
          <Route path="/quiz/:slug"     component={Quiz} />
          <Route path="/search"         component={Search} />
          <Route path="/achievements"   component={Achievements} />
          <Route path="/bookmarks"      component={Bookmarks} />
          <Route path="/profile"        component={Profile} />
          <Route path="/streaks"        component={Streaks} />
          <Route path="/quiz-stats"     component={QuizStats} />
          <Route path="/leaderboard"    component={Leaderboard} />
          <Route path="/analytics"     component={Analytics} />
          <Route path="/sign-in/*?"     component={SignInPage} />
          <Route path="/sign-up/*?"     component={SignUpPage} />
          <Route                        component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={`${basePath}/`}
      signUpFallbackRedirectUrl={`${basePath}/`}
      afterSignOutUrl={`${basePath}/`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back to GenAI Learn",
            subtitle: "Sign in to continue your learning journey",
          },
        },
        signUp: {
          start: {
            title: "Join GenAI Learn",
            subtitle: "Start your journey into generative AI",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AppProvider>
            <AchievementsProvider>
              <SyncProvider>
                <PrefsProvider>
                  <AchievementToastManager />
                  <Router />
                </PrefsProvider>
              </SyncProvider>
            </AchievementsProvider>
          </AppProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
