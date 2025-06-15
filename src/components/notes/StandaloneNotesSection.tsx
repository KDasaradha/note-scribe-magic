
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileText } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { Note } from "@/types";

interface StandaloneNotesSectionProps {
  standaloneNotes: Note[];
  notebooks: Note[];
  isCreateNoteOpen: boolean;
  setIsCreateNoteOpen: (open: boolean) => void;
  newNoteTitle: string;
  setNewNoteTitle: (title: string) => void;
  selectedNotebook: string | null;
  setSelectedNotebook: (id: string | null) => void;
  handleCreateNoteClick: () => void;
}

export function StandaloneNotesSection({
  standaloneNotes,
  notebooks,
  isCreateNoteOpen,
  setIsCreateNoteOpen,
  newNoteTitle,
  setNewNoteTitle,
  selectedNotebook,
  setSelectedNotebook,
  handleCreateNoteClick,
}: StandaloneNotesSectionProps) {
  if (standaloneNotes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Quick Notes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Standalone notes for quick thoughts
          </p>
        </div>
        <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Create a standalone note or add it to an existing notebook.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="note-title">Note Title</Label>
                <Input 
                  id="note-title" 
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="My Note"
                  className="mt-2"
                  autoFocus
                />
              </div>
              
              {notebooks.length > 0 && (
                <div>
                  <Label>Add to Notebook (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button 
                      type="button"
                      variant={selectedNotebook === null ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedNotebook(null)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Standalone
                    </Button>
                    
                    {notebooks.map(notebook => (
                      <Button
                        key={notebook.id}
                        type="button"
                        variant={selectedNotebook === notebook.id ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedNotebook(notebook.id)}
                      >
                        <span className="truncate">{notebook.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNoteClick}>Create Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {standaloneNotes.map(note => (
          <div key={note.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <NoteCard note={note} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
