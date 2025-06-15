
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, Plus, PlusCircle } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { Note } from "@/types";

interface NotebookSectionProps {
  notebooks: Note[];
  getChildNotes: (parentId: string) => Note[];
  isCreateNotebookOpen: boolean;
  setIsCreateNotebookOpen: (open: boolean) => void;
  isCreateNoteOpen: boolean;
  setIsCreateNoteOpen: (open: boolean) => void;
  newNotebookTitle: string;
  setNewNotebookTitle: (title: string) => void;
  newNoteTitle: string;
  setNewNoteTitle: (title: string) => void;
  selectedNotebook: string | null;
  setSelectedNotebook: (id: string | null) => void;
  handleCreateNotebookClick: () => void;
  handleCreateNoteClick: () => void;
}

export function NotebookSection({
  notebooks,
  getChildNotes,
  isCreateNotebookOpen,
  setIsCreateNotebookOpen,
  isCreateNoteOpen,
  setIsCreateNoteOpen,
  newNotebookTitle,
  setNewNotebookTitle,
  newNoteTitle,
  setNewNoteTitle,
  selectedNotebook,
  setSelectedNotebook,
  handleCreateNotebookClick,
  handleCreateNoteClick,
}: NotebookSectionProps) {
  if (notebooks.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800">
        <Book className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
          No Notebooks Yet
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-6">
          Organize your notes better by creating your first notebook
        </p>
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Book className="mr-2 h-4 w-4" />
              Create Your First Notebook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notebook</DialogTitle>
              <DialogDescription>
                A notebook can contain multiple pages and helps organize your notes.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="notebook-title">Notebook Title</Label>
              <Input 
                id="notebook-title" 
                value={newNotebookTitle}
                onChange={(e) => setNewNotebookTitle(e.target.value)}
                placeholder="My Notebook"
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNotebookClick}>Create Notebook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Notebooks
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your thoughts and ideas
          </p>
        </div>
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Book className="mr-2 h-4 w-4" />
              New Notebook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notebook</DialogTitle>
              <DialogDescription>
                A notebook can contain multiple pages and helps organize your notes.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="notebook-title">Notebook Title</Label>
              <Input 
                id="notebook-title" 
                value={newNotebookTitle}
                onChange={(e) => setNewNotebookTitle(e.target.value)}
                placeholder="My Notebook"
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNotebookClick}>Create Notebook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {notebooks.map(notebook => {
          const childNotes = getChildNotes(notebook.id);
          
          return (
            <div key={notebook.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <NoteCard note={notebook} />
                
                {childNotes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Pages ({childNotes.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {childNotes.slice(0, 3).map(note => (
                        <div key={note.id} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          • {note.title}
                        </div>
                      ))}
                      {childNotes.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          +{childNotes.length - 3} more pages
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-3 w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => {
                    setSelectedNotebook(notebook.id);
                    setIsCreateNoteOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Page
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
