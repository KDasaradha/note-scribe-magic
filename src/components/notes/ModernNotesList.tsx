
import { Loader2, Plus, Search, Grid, List, MoreHorizontal, Filter } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyNotesState } from "./EmptyNotesState";
import { ModernNotebookCard } from "./ModernNotebookCard";
import { ModernNoteCard } from "./ModernNoteCard";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { QuickActions } from "./QuickActions";

export function ModernNotesList() {
  const {
    notes,
    isLoading,
    notebooks,
    standaloneNotes,
    getChildNotes,
    selectedNotebook,
    setSelectedNotebook,
    isCreateNoteOpen,
    setIsCreateNoteOpen,
    isCreateNotebookOpen,
    setIsCreateNotebookOpen,
    newNotebookTitle,
    setNewNotebookTitle,
    newNoteTitle,
    setNewNoteTitle,
    handleCreateNotebookClick,
    handleCreateNoteClick,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyNotesState
        isCreateNotebookOpen={isCreateNotebookOpen}
        setIsCreateNotebookOpen={setIsCreateNotebookOpen}
        isCreateNoteOpen={isCreateNoteOpen}
        setIsCreateNoteOpen={setIsCreateNoteOpen}
        newNotebookTitle={newNotebookTitle}
        setNewNotebookTitle={setNewNotebookTitle}
        newNoteTitle={newNoteTitle}
        setNewNoteTitle={setNewNoteTitle}
        handleCreateNotebookClick={handleCreateNotebookClick}
        handleCreateNoteClick={handleCreateNoteClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Workspace
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {notes.length} {notes.length === 1 ? 'item' : 'items'} • Last updated today
              </p>
            </div>
            <QuickActions 
              onCreateNote={() => setIsCreateNoteOpen(true)}
              onCreateNotebook={() => setIsCreateNotebookOpen(true)}
            />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search notes and notebooks..." 
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button variant="ghost" size="sm" className="bg-white dark:bg-gray-700 shadow-sm">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {notebooks.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notebooks
              </h2>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notebooks.map(notebook => (
                <ModernNotebookCard 
                  key={notebook.id} 
                  notebook={notebook} 
                  childNotes={getChildNotes(notebook.id)}
                />
              ))}
            </div>
          </div>
        )}

        {standaloneNotes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Notes
              </h2>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {standaloneNotes.map(note => (
                <ModernNoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateNoteDialog
        isOpen={isCreateNoteOpen}
        setIsOpen={setIsCreateNoteOpen}
        title={newNoteTitle}
        setTitle={setNewNoteTitle}
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        setSelectedNotebook={setSelectedNotebook}
        onCreateNote={handleCreateNoteClick}
        onCreateNotebook={() => setIsCreateNotebookOpen(true)}
      />
    </div>
  );
}
