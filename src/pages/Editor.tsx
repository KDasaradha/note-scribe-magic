
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { useNotes } from "@/hooks/use-notes";
import { Book, ChevronLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Editor = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { noteId } = useParams();
  const { getNote, getChildNotes, isLoading: notesLoading } = useNotes();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [childNotes, setChildNotes] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (noteId && !notesLoading) {
      const currentNote = getNote(noteId);
      setNote(currentNote);
      
      if (currentNote?.isNotebook) {
        setChildNotes(getChildNotes(noteId));
      } else {
        setChildNotes([]);
      }
    }
  }, [noteId, notesLoading, getNote, getChildNotes]);

  useEffect(() => {
    // Set page title
    const noteTitle = note?.title || "Notebook";
    document.title = `${noteTitle} - Notes App`;
    
    return () => {
      document.title = "Notes App";
    };
  }, [note]);

  if (authLoading || !isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="bg-white border-b border-blue-100 px-4 py-2">
            <div className="container flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Notebooks
              </Button>
              
              {note?.parentId && (
                <>
                  <span className="mx-2 text-blue-300">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/editor/${note.parentId}`)}
                  >
                    <Book className="h-4 w-4 mr-1" />
                    Parent Notebook
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <main className="flex-1 p-4 md:p-6 overflow-hidden">
            {note?.isNotebook && childNotes.length > 0 ? (
              <div className="container">
                <div className="flex items-center mb-6">
                  <Book className="text-blue-700 h-6 w-6 mr-2" />
                  <h1 className="text-2xl font-bold text-blue-900">{note.title}</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {childNotes.map((childNote) => (
                    <div 
                      key={childNote.id} 
                      className="bg-white rounded-lg shadow-md border border-blue-100 p-4 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate(`/editor/${childNote.id}`)}
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 text-blue-600 mr-2" />
                        <h3 className="font-medium text-blue-800">{childNote.title}</h3>
                      </div>
                      <p className="text-sm text-blue-700 line-clamp-2">
                        {childNote.content 
                          ? childNote.content.substring(0, 100) + (childNote.content.length > 100 ? "..." : "")
                          : "No content"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="notebook-editor-container rounded-lg overflow-hidden shadow-lg border border-blue-200 bg-white">
                <NoteEditor />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
