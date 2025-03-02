import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Loader2, Save, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

export function NoteEditor() {
  const { noteId } = useParams();
  const { getNote, createNote, updateNote, deleteNote, isLoading } = useNotes();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const isNewNote = noteId === "new";
  
  useEffect(() => {
    if (!isNewNote && noteId) {
      const existingNote = getNote(noteId);
      
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
      } else {
        toast.error("Note not found");
        navigate("/dashboard");
      }
    }
    
    if (isNewNote && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [noteId, getNote, navigate, isNewNote]);
  
  useEffect(() => {
    if (isNewNote) {
      setHasUnsavedChanges(title.trim() !== "" || content.trim() !== "");
    } else if (noteId) {
      const existingNote = getNote(noteId);
      if (existingNote) {
        setHasUnsavedChanges(
          title !== existingNote.title || content !== existingNote.content
        );
      }
    }
  }, [title, content, isNewNote, noteId, getNote]);
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your note");
      titleInputRef.current?.focus();
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isNewNote) {
        const newNote = await createNote(title, content);
        navigate(`/editor/${newNote.id}`, { replace: true });
        setHasUnsavedChanges(false);
      } else if (noteId) {
        await updateNote(noteId, title, content);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!noteId || isNewNote) return;
    
    setIsDeleting(true);
    
    try {
      await deleteNote(noteId);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading && !isNewNote) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Note"
              className="border-none shadow-none text-xl font-medium placeholder:text-muted-foreground/50 max-w-[280px] md:max-w-md"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isNewNote || isDeleting}
                  className="text-destructive hover:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={cn(
                "transition-all",
                hasUnsavedChanges ? "opacity-100" : "opacity-70"
              )}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b">
          <div className="container">
            <TabsList className="mt-1">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="container py-4">
            <TabsContent value="write" className="mt-0 h-full">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note here... (Markdown supported)"
                className="min-h-[calc(100vh-12rem)] resize-none border-none shadow-none focus-visible:ring-0 p-0"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0 h-full">
              {content ? (
                <div className="prose-custom">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  No content to preview.
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
