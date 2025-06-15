
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, Plus, Sparkles } from "lucide-react";

interface EmptyNotesStateProps {
  isCreateNotebookOpen: boolean;
  setIsCreateNotebookOpen: (open: boolean) => void;
  isCreateNoteOpen: boolean;
  setIsCreateNoteOpen: (open: boolean) => void;
  newNotebookTitle: string;
  setNewNotebookTitle: (title: string) => void;
  newNoteTitle: string;
  setNewNoteTitle: (title: string) => void;
  handleCreateNotebookClick: () => void;
  handleCreateNoteClick: () => void;
}

export function EmptyNotesState({
  isCreateNotebookOpen,
  setIsCreateNotebookOpen,
  isCreateNoteOpen,
  setIsCreateNoteOpen,
  newNotebookTitle,
  setNewNotebookTitle,
  newNoteTitle,
  setNewNoteTitle,
  handleCreateNotebookClick,
  handleCreateNoteClick,
}: EmptyNotesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-full p-8 mb-8">
        <Sparkles className="h-16 w-16 text-blue-600 dark:text-blue-400" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome to Your Notes
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Start organizing your thoughts with notebooks and notes. Create your first entry to begin your journey.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Book className="mr-2 h-5 w-5" />
              Create Notebook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Your First Notebook</DialogTitle>
              <DialogDescription className="text-base">
                Notebooks help you organize related notes together. Perfect for projects, subjects, or topics.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="notebook-title" className="text-sm font-medium">Notebook Name</Label>
              <Input 
                id="notebook-title" 
                value={newNotebookTitle}
                onChange={(e) => setNewNotebookTitle(e.target.value)}
                placeholder="e.g., Work Notes, Personal Journal"
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNotebookClick} className="w-full">
                Create Notebook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg" className="px-8 py-3">
              <Plus className="mr-2 h-5 w-5" />
              Quick Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create a Quick Note</DialogTitle>
              <DialogDescription className="text-base">
                Start with a standalone note that you can organize later.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="note-title" className="text-sm font-medium">Note Title</Label>
              <Input 
                id="note-title" 
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="e.g., Meeting Notes, Ideas"
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNoteClick} className="w-full">
                Create Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
