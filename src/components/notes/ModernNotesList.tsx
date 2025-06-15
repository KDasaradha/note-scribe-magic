
import { Loader2, Plus, Search, Filter, Grid, List } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyNotesState } from "./EmptyNotesState";
import { ModernNotebookCard } from "./ModernNotebookCard";
import { ModernNoteCard } from "./ModernNoteCard";

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your notes...</p>
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
    <div className="h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Workspace</h1>
              <p className="text-gray-400 text-sm">Your notes and notebooks</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search" 
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Filter className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsCreateNoteOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="notebooks" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Notebooks</TabsTrigger>
              <TabsTrigger value="pages" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Pages</TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Recent</TabsTrigger>
              <TabsTrigger value="starred" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Starred</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {notebooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-white mb-4">Notebooks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            <h2 className="text-lg font-medium text-white mb-4">Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {standaloneNotes.map(note => (
                <ModernNoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
