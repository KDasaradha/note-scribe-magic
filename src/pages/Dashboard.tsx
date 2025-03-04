
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NotesList } from "@/components/notes/NotesList";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Book } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Set page title
    document.title = "My Notebooks - Notes App";
    
    return () => {
      document.title = "Notes App";
    };
  }, []);

  if (isLoading || !isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container max-w-6xl py-8 px-4 md:px-6">
              <div className="mb-8 flex items-center">
                <Book className="text-primary h-8 w-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Notebooks</h1>
                  <p className="text-muted-foreground mt-1">
                    Organize your notes in notebook collections
                  </p>
                </div>
              </div>
              <NotesList />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
