import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import LevelPlay from "./pages/LevelPlay";
import Duel from "./pages/Duel";
import Leaderboard from "./pages/Leaderboard";
import Certificate from "./pages/Certificate";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/game"} component={Game} />
      <Route path={"/level/:levelId"} component={LevelPlay} />
      <Route path={"/duel"} component={Duel} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/certificate"} component={Certificate} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
