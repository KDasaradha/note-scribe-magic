
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { GenderSelection } from "@/components/training/GenderSelection";
import { TrainingSettings } from "@/types";

const Training = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [settings, setSettings] = useState<TrainingSettings | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Set page title
    document.title = "Training - Notes App";
    
    return () => {
      document.title = "Notes App";
    };
  }, []);

  const handleStartTraining = (selectedSettings: TrainingSettings) => {
    setSettings(selectedSettings);
    setTrainingStarted(true);
    console.log("Training started with settings:", selectedSettings);
    // Here you would implement the actual training functionality
  };

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
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Training Center</h1>
                <p className="text-muted-foreground mt-1">
                  Customize your training experience
                </p>
              </div>
              
              {!trainingStarted ? (
                <GenderSelection onSelect={handleStartTraining} />
              ) : (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                    <h2 className="text-xl font-semibold mb-4">Training in Progress</h2>
                    <div className="space-y-2">
                      <p><strong>Gender:</strong> {settings?.gender === "male" ? "Male" : "Female"}</p>
                      <p><strong>Level:</strong> {settings?.level}</p>
                      <p><strong>Duration:</strong> {settings?.duration} minutes</p>
                    </div>
                    <div className="mt-6 p-4 bg-muted rounded-md">
                      <p className="text-center text-muted-foreground">
                        Training simulation in progress...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Training;
