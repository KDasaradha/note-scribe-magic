
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "@/hooks/use-notes";
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
import { exportMarkdownToFile, markdownGuide } from "@/utils/markdownUtils";
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

// Auto-save interval in milliseconds
const AUTO_SAVE_INTERVAL = 5000;

export function NoteEditor() {
  const { noteId } = useParams();
  const { getNote, createNote, updateNote, deleteNote, createNotebook, isLoading } = useNotes();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const [isCreatingSubpage, setIsCreatingSubpage] = useState(false);
  const [newSubpageTitle, setNewSubpageTitle] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isNewNote = noteId === "new";
  
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

  // Setup auto-save
  useEffect(() => {
    if (hasUnsavedChanges && !isNewNote && noteId) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, title, hasUnsavedChanges]);
  
  const handleAutoSave = async () => {
    if (!hasUnsavedChanges || isNewNote || !noteId) return;
    
    try {
      const updatedNote = await updateNote(noteId, title, content);
      setLastSaved(new Date(updatedNote.updatedAt));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };
  
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
        setLastSaved(new Date(newNote.updatedAt));
      } else if (noteId) {
        const updatedNote = await updateNote(noteId, title, content);
        setHasUnsavedChanges(false);
        setLastSaved(new Date(updatedNote.updatedAt));
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
      const note = getNote(noteId);
      
      if (note?.isNotebook) {
        const newNote = await createNote(newSubpageTitle, "", noteId);
        toast.success("Subpage created successfully");
        navigate(`/editor/${newNote.id}`);
      } else {
        const updatedNote = await updateNote(noteId, title, content);
        const updatedNoteWithNotebook = { ...updatedNote, isNotebook: true };
        const newNote = await createNote(newSubpageTitle, "", noteId);
        toast.success("Subpage created successfully");
        navigate(`/editor/${newNote.id}`);
      }
      
      setNewSubpageTitle("");
      setIsCreatingSubpage(false);
    } catch (error) {
      console.error("Failed to create subpage:", error);
      toast.error("Failed to create subpage");
    }
  };

  const insertTableTemplate = () => {
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(start);
    
    setContent(beforeText + tableTemplate + afterText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tableTemplate.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const insertChecklist = () => {
    const checklistTemplate = `
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
`;
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(start);
    
    setContent(beforeText + checklistTemplate + afterText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + checklistTemplate.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const insertMarkdown = (markdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText = '';
    
    switch (markdown) {
      case 'bold':
        newText = beforeText + `**${selectedText || 'bold text'}**` + afterText;
        break;
      case 'italic':
        newText = beforeText + `*${selectedText || 'italic text'}*` + afterText;
        break;
      case 'heading1':
        newText = beforeText + `\n# ${selectedText || 'Heading 1'}\n` + afterText;
        break;
      case 'heading2':
        newText = beforeText + `\n## ${selectedText || 'Heading 2'}\n` + afterText;
        break;
      case 'heading3':
        newText = beforeText + `\n### ${selectedText || 'Heading 3'}\n` + afterText;
        break;
      case 'list':
        newText = beforeText + `\n- ${selectedText || 'List item'}\n` + afterText;
        break;
      case 'orderedList':
        newText = beforeText + `\n1. ${selectedText || 'List item'}\n` + afterText;
        break;
      case 'link':
        newText = beforeText + `[${selectedText || 'Link text'}](url)` + afterText;
        break;
      case 'image':
        newText = beforeText + `![${selectedText || 'Alt text'}](image-url)` + afterText;
        break;
      case 'code':
        newText = beforeText + "\n```\n" + (selectedText || 'code here') + "\n```\n" + afterText;
        break;
      case 'quote':
        newText = beforeText + `\n> ${selectedText || 'Blockquote'}\n` + afterText;
        break;
      case 'checklist':
        newText = beforeText + `\n- [ ] ${selectedText || 'Task'}\n` + afterText;
        break;
      case 'table':
        newText = beforeText + `\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n` + afterText;
        break;
      default:
        newText = content;
    }

    setContent(newText);
    setHasUnsavedChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      const cursorPos = markdown === 'code' 
        ? beforeText.length + 5 
        : beforeText.length + markdown.length + 4;
      textarea.selectionStart = cursorPos;
      textarea.selectionEnd = cursorPos;
    }, 0);
  };
  
  const loadSampleMarkdown = () => {
    if (content && hasUnsavedChanges) {
      if (!window.confirm("Loading sample markdown will replace your current content. Continue?")) {
        return;
      }
    }
    setContent(markdownGuide);
    setTitle(title || "Markdown Guide");
    setHasUnsavedChanges(true);
    setActiveTab("write");
    toast.success("Sample markdown loaded");
  };

  const exportToFile = () => {
    if (!content.trim()) {
      toast.error("Nothing to export - note is empty");
      return;
    }
    
    exportMarkdownToFile(content, title || "untitled-note");
    toast.success("Markdown file downloaded");
  };

  const handleContextMenuInsert = useCallback((type: string) => {
    insertMarkdown(type);
  }, []);

  const handleCopySelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = content.substring(textarea.selectionStart, textarea.selectionEnd);
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast.success("Copied to clipboard");
    }
  }, [content]);

  const handleDeleteSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const newText = content.substring(0, start) + content.substring(end);
      setContent(newText);
      setHasUnsavedChanges(true);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start;
        textarea.selectionEnd = start;
      }, 0);
    }
  }, [content]);
  
  if (isLoading && !isNewNote) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
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
                onInsertMarkdown={handleContextMenuInsert}
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
