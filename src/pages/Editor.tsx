
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/hooks/use-notes";
import { useNoteHierarchy } from "@/hooks/use-note-hierarchy";
import { useNoteOperations } from "@/hooks/use-note-operations";
import { Note } from "@/types";
import { toast } from "sonner";
import { EditorBreadcrumb } from "@/components/notes/EditorBreadcrumb";
import { NotebookOverview } from "@/components/notes/NotebookOverview";

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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-950" onKeyDown={handleKeyDown} tabIndex={-1}>
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          
          <EditorBreadcrumb 
            note={note}
            parentChain={parentChain}
            onCreateSubpage={handleCreateSubpage}
            onNoteAction={handleNoteOptions}
            noteId={noteId}
          />
          
          <div className="flex-1 overflow-hidden">
            {note?.isNotebook && childNotes.length > 0 ? (
              <NotebookOverview 
                note={note}
                childNotes={childNotes}
                onCreateSubpage={handleCreateSubpage}
              />
            ) : (
              <div className="h-full overflow-hidden flex flex-col bg-white dark:bg-gray-900">
                <ScrollArea className="flex-1">
                  <div className="container max-w-5xl mx-auto p-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
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
