
import { Loader2 } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { EmptyNotesState } from "./EmptyNotesState";
import { NotebookSection } from "./NotebookSection";
import { StandaloneNotesSection } from "./StandaloneNotesSection";

export function NotesList() {
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your notes...</p>
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
    <div className="space-y-12">
      <NotebookSection
        notebooks={notebooks}
        getChildNotes={getChildNotes}
        isCreateNotebookOpen={isCreateNotebookOpen}
        setIsCreateNotebookOpen={setIsCreateNotebookOpen}
        isCreateNoteOpen={isCreateNoteOpen}
        setIsCreateNoteOpen={setIsCreateNoteOpen}
        newNotebookTitle={newNotebookTitle}
        setNewNotebookTitle={setNewNotebookTitle}
        newNoteTitle={newNoteTitle}
        setNewNoteTitle={setNewNoteTitle}
        selectedNotebook={selectedNotebook}
        setSelectedNotebook={setSelectedNotebook}
        handleCreateNotebookClick={handleCreateNotebookClick}
        handleCreateNoteClick={handleCreateNoteClick}
      />

      <StandaloneNotesSection
        standaloneNotes={standaloneNotes}
        notebooks={notebooks}
        isCreateNoteOpen={isCreateNoteOpen}
        setIsCreateNoteOpen={setIsCreateNoteOpen}
        newNoteTitle={newNoteTitle}
        setNewNoteTitle={setNewNoteTitle}
        selectedNotebook={selectedNotebook}
        setSelectedNotebook={setSelectedNotebook}
        handleCreateNoteClick={handleCreateNoteClick}
      />
    </div>
  );
}
