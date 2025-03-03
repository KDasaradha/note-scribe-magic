
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container py-8">
              <div className="mb-8 flex items-center">
                <Book className="text-blue-800 h-8 w-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-blue-900">My Notebooks</h1>
                  <p className="text-blue-700 mt-1">
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
