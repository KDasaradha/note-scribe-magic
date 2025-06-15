
import { useState } from "react";
import { FileText, BookOpen, Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Note } from "@/types";

interface CreateNoteDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  notebooks: Note[];
  selectedNotebook: string | null;
  setSelectedNotebook: (id: string | null) => void;
  onCreateNote: () => void;
  onCreateNotebook: () => void;
}

export function CreateNoteDialog({
  isOpen,
  setIsOpen,
  title,
  setTitle,
  notebooks,
  selectedNotebook,
  setSelectedNotebook,
  onCreateNote,
  onCreateNotebook,
}: CreateNoteDialogProps) {
  const [noteType, setNoteType] = useState<'note' | 'notebook'>('note');

  const handleCreate = () => {
    if (noteType === 'notebook') {
      onCreateNotebook();
    } else {
      onCreateNote();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New {noteType === 'notebook' ? 'Notebook' : 'Note'}</DialogTitle>
          <DialogDescription>
            {noteType === 'notebook' 
              ? 'Organize your notes in a structured notebook'
              : 'Create a quick note or add it to an existing notebook'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Note Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={noteType === 'note' ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setNoteType('note')}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">Quick Note</span>
              </Button>
              <Button
                type="button"
                variant={noteType === 'notebook' ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setNoteType('notebook')}
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Notebook</span>
              </Button>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="note-title" className="text-sm font-medium">
              {noteType === 'notebook' ? 'Notebook' : 'Note'} Title
            </Label>
            <Input 
              id="note-title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={noteType === 'notebook' ? 'My Notebook' : 'My Note'}
              autoFocus
            />
          </div>
          
          {/* Notebook Selection (only for notes) */}
          {noteType === 'note' && notebooks.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Location (Optional)</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                <Button 
                  type="button"
                  variant={selectedNotebook === null ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => setSelectedNotebook(null)}
                >
                  <FileText className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Standalone Note</div>
                    <div className="text-xs text-muted-foreground">Not in any notebook</div>
                  </div>
                </Button>
                
                {notebooks.map(notebook => (
                  <Button
                    key={notebook.id}
                    type="button"
                    variant={selectedNotebook === notebook.id ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => setSelectedNotebook(notebook.id)}
                  >
                    <Folder className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium truncate">{notebook.title}</div>
                      <div className="text-xs text-muted-foreground">Notebook</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            Create {noteType === 'notebook' ? 'Notebook' : 'Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
