
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <header className="border-b h-16 border-border">
        <div className="container h-full flex items-center justify-between">
          <h1 className="font-semibold text-xl">Notes</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <div className="container max-w-6xl px-4 py-12 md:py-20 flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="flex flex-col space-y-6 flex-1 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Your ideas, organized and beautiful
              </h1>
              <p className="text-xl text-muted-foreground">
                Capture your thoughts with our elegant markdown notes app. Simple, powerful, and designed for focus.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                className="md:w-auto w-full"
              >
                Get Started
              </Button>
            </div>
          </div>

          <div className="glass-card rounded-xl border shadow-md w-full max-w-md overflow-hidden bg-card">
            <div className="border-b bg-muted p-3">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 h-3 w-48 rounded-full bg-muted"></div>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-4">
                <h3 className="font-bold text-xl">Meeting Notes</h3>
                <div className="space-y-2 prose-custom text-sm">
                  <p>Key points from today's meeting:</p>
                  <ul>
                    <li>Launch new product by Q3</li>
                    <li>Review marketing strategy</li>
                    <li>Finalize budget for next quarter</li>
                  </ul>
                  <p>**Action items:**</p>
                  <ul>
                    <li>Follow up with design team</li>
                    <li>Schedule demo with client</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-muted py-16" id="auth-section">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Get Started Now
            </h2>
            <AuthForm />
          </div>
        </div>
      </main>

      <footer className="border-t py-8 border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Notes App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
