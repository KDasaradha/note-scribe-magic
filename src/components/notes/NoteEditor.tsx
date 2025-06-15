
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "@/hooks/use-notes";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useMarkdownEditor } from "@/hooks/use-markdown-editor";
import { useNoteOperations } from "@/hooks/use-note-operations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, Loader2, Save, Trash, Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Link, Image, Code, Quote, HelpCircle, FileDown, BookOpen,
  CheckSquare, Table, Plus, ArrowDown, ArrowRight, Edit, Clock
} from "lucide-react";
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
import { markdownGuide } from "@/utils/markdownUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NoteContextMenu } from "./NoteContextMenu";
import { format } from "date-fns";

export function NoteEditor() {
  const { noteId } = useParams();
  const { getNote, isLoading } = useNotes();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [isSaving, setIsSaving] = useState(false);
  const [newSubpageTitle, setNewSubpageTitle] = useState("");
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isNewNote = noteId === "new";
  
  // Use custom hooks
  const { handleCreateNote, handleUpdateNote, handleDeleteNote, isDeleting } = useNoteOperations();
  const { lastSaved, hasUnsavedChanges, setHasUnsavedChanges, setLastSaved } = useAutoSave({
    noteId,
    title,
    content,
    isNewNote,
  });
  
  const {
    textareaRef,
    insertMarkdown,
    insertTableTemplate,
    insertChecklist,
    loadSampleMarkdown,
    exportToFile,
    handleCopySelection,
    handleDeleteSelection,
  } = useMarkdownEditor({
    content,
    setContent,
    title,
    setTitle,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  });

  // Handle keyboard shortcuts for creating a new note
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Command/Ctrl + N to create a new note
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      navigate('/editor/new');
    }
  };
  
  useEffect(() => {
    if (!isNewNote && noteId) {
      const existingNote = getNote(noteId);
      
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
        setLastSaved(new Date(existingNote.updatedAt));
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
    // Set page title
    const noteTitle = title || "Note";
    document.title = `${noteTitle} - Notes App`;
    
    return () => {
      document.title = "Notes App";
    };
  }, [title]);
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your note");
      titleInputRef.current?.focus();
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isNewNote) {
        const newNote = await handleCreateNote(title, content);
        navigate(`/editor/${newNote.id}`, { replace: true });
        setHasUnsavedChanges(false);
        setLastSaved(new Date(newNote.updatedAt));
      } else if (noteId) {
        const updatedNote = await handleUpdateNote(noteId, title, content);
        setHasUnsavedChanges(false);
        setLastSaved(new Date(updatedNote.updatedAt));
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSubpage = async () => {
    if (!noteId || isNewNote) {
      toast.error("Please save the current note first");
      return;
    }
    
    if (!newSubpageTitle.trim()) {
      toast.error("Please enter a title for the subpage");
      return;
    }
    
    try {
      const newNote = await handleCreateNote(newSubpageTitle, "", noteId);
      toast.success("Subpage created successfully");
      navigate(`/editor/${newNote.id}`);
      setNewSubpageTitle("");
    } catch (error) {
      console.error("Failed to create subpage:", error);
      toast.error("Failed to create subpage");
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
    <div className="h-full flex flex-col" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="border-b">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Input
              ref={titleInputRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Untitled Note"
              className="border-none shadow-none text-xl font-medium placeholder:text-muted-foreground/50 max-w-[280px] md:max-w-md"
            />

            {lastSaved && (
              <div className="ml-4 flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {hasUnsavedChanges ? "Unsaved changes" : `Last saved ${format(lastSaved, 'h:mm a')}`}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subpage
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Create Subpage</h4>
                  <p className="text-sm text-muted-foreground">
                    Add a new page nested under this one
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Input 
                      placeholder="Subpage title" 
                      value={newSubpageTitle} 
                      onChange={(e) => setNewSubpageTitle(e.target.value)}
                    />
                    <Button onClick={handleCreateSubpage}>
                      Create Subpage
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToFile}
              title="Export to Markdown File"
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  title="Learn Markdown"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Examples
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Markdown Guide</DialogTitle>
                  <DialogDescription>
                    Load this sample markdown into your editor to learn and experiment with markdown syntax.
                  </DialogDescription>
                </DialogHeader>
                <div className="prose-custom my-4 max-h-[60vh] overflow-y-auto p-4 border rounded-md">
                  <ReactMarkdown>{markdownGuide}</ReactMarkdown>
                </div>
                <div className="flex justify-end">
                  <Button onClick={loadSampleMarkdown}>
                    Load into Editor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
                    onClick={() => noteId && handleDeleteNote(noteId)}
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
          <div className="container flex flex-col sm:flex-row sm:items-center">
            <TabsList className="mt-1">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-1 my-2 sm:ml-4 overflow-x-auto pb-1 sm:pb-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('bold')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('heading1')}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('heading2')}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('list')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('orderedList')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={insertChecklist}
                title="Checklist"
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={insertTableTemplate}
                title="Insert Table"
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('link')}
                title="Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('image')}
                title="Image"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('code')}
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertMarkdown('quote')}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="container py-4">
            <TabsContent value="write" className="mt-0 h-full">
              <NoteContextMenu 
                onInsertMarkdown={insertMarkdown}
                onCopySelection={handleCopySelection}
                onDeleteSelection={handleDeleteSelection}
              >
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Start writing your note here... (Markdown supported, right-click for more options)"
                  className="min-h-[calc(100vh-12rem)] resize-none border-none shadow-none focus-visible:ring-0 p-0 font-mono text-sm"
                />
              </NoteContextMenu>
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
