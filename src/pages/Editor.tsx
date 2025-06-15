
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Book, ChevronLeft, FileText, ArrowRight, PlusCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/use-notes";
import { useNoteHierarchy } from "@/hooks/use-note-hierarchy";
import { useNoteOperations } from "@/hooks/use-note-operations";
import { Note } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { ScrollArea } from "@/components/ui/scroll-area";

const Editor = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { noteId } = useParams();
  const { getNote, isLoading: notesLoading } = useNotes();
  const { buildParentChain, getChildNotes } = useNoteHierarchy();
  const { handleCreateNote, handleDuplicateNote, handleDeleteNote, handleMoveNote } = useNoteOperations();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [childNotes, setChildNotes] = useState<Note[]>([]);
  const [parentChain, setParentChain] = useState<Note[]>([]);
  const { theme } = useTheme();

  // Handle keyboard shortcuts for creating a new note
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Command/Ctrl + N to create a new note
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      navigate('/editor/new');
    }
  };

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

      if (currentNote && currentNote.parentId) {
        const chain = buildParentChain(currentNote);
        setParentChain(chain);
      } else {
        setParentChain([]);
      }
    }
  }, [noteId, notesLoading, getNote, getChildNotes, buildParentChain]);

  useEffect(() => {
    // Set page title
    const noteTitle = note?.title || "Notebook";
    document.title = `${noteTitle} - Notes App`;
    
    return () => {
      document.title = "Notes App";
    };
  }, [note]);

  const handleCreateSubpage = async () => {
    if (!noteId || noteId === "new") {
      toast.error("Please save the current note first");
      return;
    }
    
    try {
      const defaultTitle = `Untitled ${Date.now().toString().slice(-4)}`;
      const newNote = await handleCreateNote(defaultTitle, "", noteId);
      toast.success("New page created");
      navigate(`/editor/${newNote.id}`);
    } catch (error) {
      console.error("Failed to create subpage:", error);
      toast.error("Failed to create page");
    }
  };

  const handleNoteOptions = async (action: string, targetNoteId: string) => {
    switch(action) {
      case 'duplicate':
        try {
          await handleDuplicateNote(targetNoteId);
        } catch (error) {
          console.error("Failed to duplicate note:", error);
        }
        break;
        
      case 'delete':
        try {
          await handleDeleteNote(targetNoteId);
        } catch (error) {
          console.error("Failed to delete note:", error);
        }
        break;

      case 'moveToRoot':
        try {
          await handleMoveNote(targetNoteId, null);
          navigate("/dashboard");
        } catch (error) {
          console.error("Failed to move note:", error);
        }
        break;
        
      default:
        break;
    }
  };

  if (authLoading || !isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background" onKeyDown={handleKeyDown} tabIndex={-1}>
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          
          <div className="bg-card border-b border-border px-4 py-2 shadow-sm">
            <div className="container max-w-6xl flex items-center flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mr-1 text-primary h-8"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                All Notebooks
              </Button>
              
              {parentChain.length > 0 && (
                <>
                  {parentChain.map((parent, index) => (
                    <div key={parent.id} className="flex items-center">
                      <span className="mx-1 text-muted-foreground">/</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/editor/${parent.id}`)}
                        className="text-primary h-8 px-2"
                      >
                        {index === 0 ? (
                          <Book className="h-4 w-4 mr-1 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 mr-1 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[150px]">{parent.title}</span>
                      </Button>
                      {index < parentChain.length - 1 && (
                        <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  ))}
                  <span className="mx-1 text-muted-foreground">/</span>
                  <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                    {note?.title}
                  </span>
                </>
              )}

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreateSubpage}
                  className="gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  New Page
                </Button>

                {note && noteId !== "new" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleNoteOptions('duplicate', note.id)}
                      >
                        Duplicate
                      </DropdownMenuItem>
                      {note.parentId && (
                        <DropdownMenuItem 
                          onClick={() => handleNoteOptions('moveToRoot', note.id)}
                        >
                          Move to root
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleNoteOptions('delete', note.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {note?.isNotebook && childNotes.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="container max-w-6xl p-4 md:p-6">
                  <div className="flex items-center mb-6">
                    <Book className="text-primary h-6 w-6 mr-2 flex-shrink-0" />
                    <h1 className="text-2xl font-bold text-foreground truncate">{note.title}</h1>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {childNotes.map((childNote) => (
                      <div 
                        key={childNote.id} 
                        className="bg-card rounded-lg shadow-md border border-border p-4 cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => navigate(`/editor/${childNote.id}`)}
                      >
                        <div className="flex items-center mb-2">
                          {childNote.isNotebook ? (
                            <Book className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          )}
                          <h3 className="font-medium text-foreground truncate">{childNote.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {childNote.content 
                            ? childNote.content.substring(0, 100) + (childNote.content.length > 100 ? "..." : "")
                            : childNote.isNotebook ? "Notebook" : "No content"}
                        </p>
                      </div>
                    ))}

                    {/* Add page button */}
                    <div 
                      className="bg-card rounded-lg border border-dashed border-border p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors min-h-[120px]"
                      onClick={handleCreateSubpage}
                    >
                      <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground font-medium">New Page</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="container max-w-5xl mx-auto p-4">
                    <div className="notebook-editor-container rounded-lg overflow-hidden shadow-lg border border-border bg-card">
                      <NoteEditor />
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
