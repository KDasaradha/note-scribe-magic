
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Book, ChevronLeft, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/use-notes";
import { Note } from "@/types";

const Editor = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { noteId } = useParams();
  const { getNote, getChildNotes, isLoading: notesLoading } = useNotes();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [childNotes, setChildNotes] = useState<Note[]>([]);
  const [parentChain, setParentChain] = useState<Note[]>([]);

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

      // Build the parent chain for breadcrumb navigation
      const buildParentChain = (note: Note | undefined, chain: Note[] = []): Note[] => {
        if (!note || !note.parentId) return chain;
        
        const parentNote = getNote(note.parentId);
        if (!parentNote) return chain;
        
        return buildParentChain(parentNote, [parentNote, ...chain]);
      };

      if (currentNote && currentNote.parentId) {
        const chain = buildParentChain(currentNote);
        setParentChain(chain);
      } else {
        setParentChain([]);
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
          
          <div className="bg-white border-b border-blue-100 px-4 py-2 shadow-sm">
            <div className="container max-w-6xl flex items-center flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mr-1 text-blue-700 h-8"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                All Notebooks
              </Button>
              
              {parentChain.length > 0 && (
                <>
                  {parentChain.map((parent, index) => (
                    <div key={parent.id} className="flex items-center">
                      <span className="mx-1 text-blue-300">/</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/editor/${parent.id}`)}
                        className="text-blue-700 h-8 px-2"
                      >
                        {index === 0 ? (
                          <Book className="h-4 w-4 mr-1 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 mr-1 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[150px]">{parent.title}</span>
                      </Button>
                      {index < parentChain.length - 1 && (
                        <ArrowRight className="h-3 w-3 mx-1 text-blue-300 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                  <span className="mx-1 text-blue-300">/</span>
                  <span className="text-sm font-medium text-blue-800 truncate max-w-[200px]">
                    {note?.title}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {note?.isNotebook && childNotes.length > 0 ? (
              <div className="container max-w-6xl">
                <div className="flex items-center mb-6">
                  <Book className="text-blue-700 h-6 w-6 mr-2 flex-shrink-0" />
                  <h1 className="text-2xl font-bold text-blue-900 truncate">{note.title}</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {childNotes.map((childNote) => (
                    <div 
                      key={childNote.id} 
                      className="bg-white rounded-lg shadow-md border border-blue-100 p-4 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate(`/editor/${childNote.id}`)}
                    >
                      <div className="flex items-center mb-2">
                        {childNote.isNotebook ? (
                          <Book className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                        )}
                        <h3 className="font-medium text-blue-800 truncate">{childNote.title}</h3>
                      </div>
                      <p className="text-sm text-blue-700 line-clamp-2">
                        {childNote.content 
                          ? childNote.content.substring(0, 100) + (childNote.content.length > 100 ? "..." : "")
                          : childNote.isNotebook ? "Notebook" : "No content"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="container max-w-5xl mx-auto">
                <div className="notebook-editor-container rounded-lg overflow-hidden shadow-lg border border-blue-200 bg-white">
                  <NoteEditor />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
