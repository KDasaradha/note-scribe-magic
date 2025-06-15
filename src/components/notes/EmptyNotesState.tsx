
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, Plus, Sparkles, ArrowRight } from "lucide-react";

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl p-8 shadow-2xl">
            <Sparkles className="h-20 w-20 text-white mx-auto animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Welcome to Your Digital Mind
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          Transform your thoughts into organized knowledge. Create notebooks to group related ideas, 
          or start with quick notes for those lightning-fast insights.
        </p>
      </div>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Notebook Card */}
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogTrigger asChild>
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Book className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Create Notebook
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Perfect for projects, research, or any collection of related thoughts. 
                  Organize your ideas with structure and clarity.
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create Your First Notebook</DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                Notebooks help you organize related notes together. Perfect for projects, subjects, or topics.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="notebook-title" className="text-sm font-medium">Notebook Name</Label>
              <Input 
                id="notebook-title" 
                value={newNotebookTitle}
                onChange={(e) => setNewNotebookTitle(e.target.value)}
                placeholder="e.g., Work Notes, Personal Journal"
                className="mt-2 h-12"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNotebookClick} className="w-full h-12 text-lg">
                Create Notebook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Note Card */}
        <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
          <DialogTrigger asChild>
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Quick Note
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Capture those fleeting thoughts instantly. No structure needed – 
                  just pure, unfiltered creativity.
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  Start Writing 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create a Quick Note</DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                Start with a standalone note that you can organize later.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="note-title" className="text-sm font-medium">Note Title</Label>
              <Input 
                id="note-title" 
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="e.g., Meeting Notes, Ideas"
                className="mt-2 h-12"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNoteClick} className="w-full h-12 text-lg">
                Create Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tips Section */}
      <div className="mt-16 text-center max-w-xl">
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          💡 <strong>Pro tip:</strong> You can always move notes between notebooks later, 
          so don't worry about perfect organization from the start.
        </p>
      </div>
    </div>
  );
}
