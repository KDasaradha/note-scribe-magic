
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileText, Zap, BookOpen } from "lucide-react";
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
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Quick Notes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Capture fleeting thoughts and spontaneous ideas
          </p>
        </div>
        <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Zap className="mr-2 h-5 w-5" />
              Quick Note
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
                        <BookOpen className="mr-2 h-4 w-4" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {standaloneNotes.map(note => (
          <div key={note.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2 mr-3">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded-full">
                  Quick Note
                </span>
              </div>
              <NoteCard note={note} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
