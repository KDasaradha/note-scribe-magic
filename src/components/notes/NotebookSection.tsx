
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, Plus, PlusCircle, ArrowRight, FolderOpen } from "lucide-react";
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
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-12 text-center border-2 border-blue-200 dark:border-blue-800 shadow-xl">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-6 w-fit mx-auto mb-8 shadow-2xl">
          <FolderOpen className="h-16 w-16 text-white" />
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Your Knowledge Hub Awaits
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
          Create your first notebook to start organizing your thoughts, projects, and ideas into meaningful collections.
        </p>
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Book className="mr-3 h-6 w-6" />
              Create Your First Notebook
              <ArrowRight className="ml-3 h-6 w-6" />
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
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
            My Notebooks
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Organize your thoughts and ideas into structured collections
          </p>
        </div>
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Book className="mr-2 h-5 w-5" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {notebooks.map(notebook => {
          const childNotes = getChildNotes(notebook.id);
          
          return (
            <div key={notebook.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="p-8">
                <NoteCard note={notebook} />
                
                {childNotes.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                      <Book className="h-4 w-4 mr-2 text-blue-500" />
                      Pages ({childNotes.length})
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                      {childNotes.slice(0, 4).map(note => (
                        <div key={note.id} className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-medium truncate">{note.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {childNotes.length > 4 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 text-center py-2">
                          +{childNotes.length - 4} more pages
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-6 w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all duration-300"
                  onClick={() => {
                    setSelectedNotebook(notebook.id);
                    setIsCreateNoteOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Page to Notebook
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
