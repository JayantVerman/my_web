import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Freelancing from "@/pages/Freelancing";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import GitHubProjects from "@/pages/GitHubProjects";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/freelancing" component={Freelancing} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/github-projects" component={GitHubProjects} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
