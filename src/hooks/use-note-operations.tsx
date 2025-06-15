
import { useState } from "react";
import { useNotes } from "./use-notes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useNoteOperations = () => {
  const { createNote, createNotebook, updateNote, deleteNote, moveNote } = useNotes();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateNote = async (title: string, content: string = "", parentId?: string) => {
    setIsCreating(true);
    try {
      const newNote = await createNote(title, content, parentId);
      toast.success("Note created successfully");
      return newNote;
    } catch (error) {
      toast.error("Failed to create note");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateNotebook = async (title: string, parentId?: string) => {
    setIsCreating(true);
    try {
      const newNotebook = await createNotebook(title, parentId);
      toast.success("Notebook created successfully");
      return newNotebook;
    } catch (error) {
      toast.error("Failed to create notebook");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateNote = async (id: string, title: string, content: string) => {
    setIsUpdating(true);
    try {
      const updatedNote = await updateNote(id, title, content);
      toast.success("Note updated successfully");
      return updatedNote;
    } catch (error) {
      toast.error("Failed to update note");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteNote = async (id: string, redirectToDashboard = true) => {
    setIsDeleting(true);
    try {
      await deleteNote(id);
      toast.success("Note deleted successfully");
      if (redirectToDashboard) {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to delete note");
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateNote = async (sourceNoteId: string, navigateToNew = true) => {
    setIsCreating(true);
    try {
      const { getNote } = useNotes();
      const sourceNote = getNote(sourceNoteId);
      
      if (!sourceNote) {
        throw new Error("Source note not found");
      }

      const newNote = await createNote(
        `${sourceNote.title} (Copy)`,
        sourceNote.content,
        sourceNote.parentId
      );

      toast.success("Note duplicated successfully");
      
      if (navigateToNew) {
        navigate(`/editor/${newNote.id}`);
      }
      
      return newNote;
    } catch (error) {
      toast.error("Failed to duplicate note");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleMoveNote = async (noteId: string, newParentId: string | null) => {
    try {
      await moveNote(noteId, newParentId);
      toast.success("Note moved successfully");
    } catch (error) {
      toast.error("Failed to move note");
      throw error;
    }
  };

  return {
    handleCreateNote,
    handleCreateNotebook,
    handleUpdateNote,
    handleDeleteNote,
    handleDuplicateNote,
    handleMoveNote,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
