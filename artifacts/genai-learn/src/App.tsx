import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

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
          <Route                        component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <PrefsProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </PrefsProvider>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
