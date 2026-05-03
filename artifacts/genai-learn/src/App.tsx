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
    socialButtonsPlacement: "bottom" as const,
  },
  variables: {
    colorPrimary: "hsl(255, 60%, 50%)",
    colorForeground: "hsl(0, 0%, 7%)",
    colorMutedForeground: "hsl(0, 0%, 40%)",
    colorDanger: "hsl(0, 72%, 50%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInput: "hsl(0, 0%, 90%)",
    colorInputForeground: "hsl(0, 0%, 7%)",
    colorNeutral: "hsl(0, 0%, 70%)",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-gray-900 font-semibold",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButtonText: "text-gray-700 font-medium",
    formFieldLabel: "text-gray-700 font-medium text-sm",
    footerActionLink: "text-violet-600 hover:text-violet-700 font-medium",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400",
    identityPreviewEditButton: "text-violet-600",
    formFieldSuccessText: "text-emerald-600",
    alertText: "text-gray-700",
    logoBox: "flex justify-center mb-2",
    logoImage: "w-12 h-12",
    socialButtonsBlockButton: "border border-gray-200 hover:bg-gray-50",
    formButtonPrimary: "bg-violet-600 hover:bg-violet-700 text-white font-medium",
    formFieldInput: "border-gray-200 bg-white text-gray-900 focus:border-violet-500 focus:ring-violet-500",
    footerAction: "bg-gray-50",
    dividerLine: "bg-gray-200",
    alert: "bg-red-50 border border-red-200",
    otpCodeFieldInput: "border-gray-200 focus:border-violet-500",
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
      <Navbar />
      <main>
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
            <PrefsProvider>
              <Router />
            </PrefsProvider>
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
