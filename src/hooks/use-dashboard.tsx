
import { useState } from "react";
import { useNotes } from "./use-notes";
import { useNoteHierarchy } from "./use-note-hierarchy";
import { useNoteOperations } from "./use-note-operations";
import { useNavigate } from "react-router-dom";

export const useDashboard = () => {
  const { notes, isLoading } = useNotes();
  const { getRootNotes, getChildNotes } = useNoteHierarchy();
  const { handleCreateNote, handleCreateNotebook } = useNoteOperations();
  const navigate = useNavigate();
  
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const rootNotes = getRootNotes();
  const notebooks = rootNotes.filter(note => note.isNotebook);
  const standaloneNotes = rootNotes.filter(note => !note.isNotebook);

  const handleCreateNotebookClick = async () => {
    if (!newNotebookTitle.trim()) return;
    
    try {
      const notebook = await handleCreateNotebook(newNotebookTitle);
      setNewNotebookTitle("");
      setIsCreateNotebookOpen(false);
      navigate(`/editor/${notebook.id}`);
    } catch (error) {
      console.error("Failed to create notebook:", error);
    }
  };

  const handleCreateNoteClick = async () => {
    if (!newNoteTitle.trim()) return;
    
    try {
      const note = await handleCreateNote(
        newNoteTitle, 
        "", 
        selectedNotebook || undefined
      );
      setNewNoteTitle("");
      setIsCreateNoteOpen(false);
      navigate(`/editor/${note.id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  return {
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
  };
};
