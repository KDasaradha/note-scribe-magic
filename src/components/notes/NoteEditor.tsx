
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, Loader2, Save, Trash, Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Link, Image, Code, Quote, HelpCircle, FileDown, BookOpen
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
} from "@/components/ui/dialog";

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
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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

  const insertMarkdown = (markdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText = '';
    
    // Different handling depending on the type of markdown
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
      default:
        newText = content;
    }

    setContent(newText);
    
    // Focus back on textarea after inserting
    setTimeout(() => {
      textarea.focus();
      // Calculate new cursor position
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
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note here... (Markdown supported)"
                className="min-h-[calc(100vh-12rem)] resize-none border-none shadow-none focus-visible:ring-0 p-0 font-mono text-sm"
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
