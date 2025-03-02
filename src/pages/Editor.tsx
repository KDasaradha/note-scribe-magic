
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";

const Editor = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Set page title
    document.title = "Notebook Editor - Notes App";
    
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
          <main className="flex-1 p-4 md:p-6 overflow-hidden">
            <div className="notebook-editor-container rounded-lg overflow-hidden shadow-lg border border-blue-200 bg-white">
              <NoteEditor />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
