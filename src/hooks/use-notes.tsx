import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./use-auth";
import { toast } from "sonner";
import { Note } from "@/types";

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  createNote: (title: string, content: string, parentId?: string) => Promise<Note>;
  createNotebook: (title: string, parentId?: string) => Promise<Note>;
  updateNote: (id: string, title: string, content: string) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  searchNotes: (query: string) => Note[];
  getChildNotes: (parentId: string) => Note[];
  getRootNotes: () => Note[];
  getNoteHierarchy: (noteId?: string) => Note[];
  moveNote: (noteId: string, newParentId: string | null) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const mockNotesStorage = {
  getNotes: (userId: string): Note[] => {
    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    return allNotes.filter((note: Note) => note.userId === userId);
  },
  
  saveNotes: (notes: Note[]) => {
    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const otherUsersNotes = allNotes.filter(
      (note: Note) => !notes.some(n => n.id === note.id)
    );
    localStorage.setItem("notes", JSON.stringify([...otherUsersNotes, ...notes]));
  }
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (user) {
      try {
        const userNotes = mockNotesStorage.getNotes(user.id);
        setNotes(userNotes);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load notes"));
        console.error("Failed to load notes:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user && notes.length > 0) {
      mockNotesStorage.saveNotes(notes);
    }
  }, [notes, user]);
  
  const createNote = async (title: string, content: string, parentId?: string): Promise<Note> => {
    if (!user) throw new Error("You must be logged in to create notes");
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: title || "Untitled Note",
        content: content || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        parentId: parentId,
      };
      
      let updatedNotes = [...notes];
      if (parentId) {
        const parentIndex = notes.findIndex(note => note.id === parentId);
        if (parentIndex !== -1) {
          const parent = {...notes[parentIndex]};
          
          if (!parent.isNotebook) {
            parent.isNotebook = true;
          }
          
          parent.children = parent.children || [];
          parent.children.push(newNote.id);
          updatedNotes[parentIndex] = parent;
        }
      }
      
      setNotes([...updatedNotes, newNote]);
      toast.success("Note created successfully");
      return newNote;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create note");
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createNotebook = async (title: string, parentId?: string): Promise<Note> => {
    if (!user) throw new Error("You must be logged in to create notebooks");
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNotebook: Note = {
        id: `notebook-${Date.now()}`,
        title: title || "Untitled Notebook",
        content: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        isNotebook: true,
        children: [],
        parentId: parentId,
      };
      
      let updatedNotes = [...notes];
      if (parentId) {
        const parentIndex = notes.findIndex(note => note.id === parentId);
        if (parentIndex !== -1) {
          const parent = {...notes[parentIndex]};
          
          if (!parent.isNotebook) {
            parent.isNotebook = true;
          }
          
          parent.children = parent.children || [];
          parent.children.push(newNotebook.id);
          updatedNotes[parentIndex] = parent;
        }
      }
      
      setNotes([...updatedNotes, newNotebook]);
      toast.success("Notebook created successfully");
      return newNotebook;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create notebook");
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateNote = async (id: string, title: string, content: string): Promise<Note> => {
    if (!user) throw new Error("You must be logged in to update notes");
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        throw new Error("Note not found");
      }
      
      const updatedNote: Note = {
        ...notes[noteIndex],
        title: title || "Untitled Note",
        content,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = updatedNote;
      
      setNotes(updatedNotes);
      toast.success("Note updated successfully");
      return updatedNote;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update note");
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteNote = async (id: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to delete notes");
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const noteExists = notes.some(note => note.id === id);
      
      if (!noteExists) {
        throw new Error("Note not found");
      }
      
      const noteToDelete = notes.find(note => note.id === id);
      
      if (noteToDelete?.isNotebook && noteToDelete.children?.length) {
        const deleteChildren = async (childIds: string[]) => {
          for (const childId of childIds) {
            const child = notes.find(note => note.id === childId);
            if (child?.children?.length) {
              await deleteChildren(child.children);
            }
          }
          return notes.filter(note => !childIds.includes(note.id));
        };
        
        const remainingNotes = await deleteChildren(noteToDelete.children);
        setNotes(remainingNotes.filter(note => note.id !== id));
      } else {
        let updatedNotes = [...notes];
        if (noteToDelete?.parentId) {
          const parentIndex = updatedNotes.findIndex(note => note.id === noteToDelete.parentId);
          if (parentIndex !== -1) {
            const parent = {...updatedNotes[parentIndex]};
            parent.children = parent.children?.filter(childId => childId !== id) || [];
            updatedNotes[parentIndex] = parent;
          }
        }
        
        setNotes(updatedNotes.filter(note => note.id !== id));
      }
      
      toast.success("Note deleted successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete note");
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getNote = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };
  
  const searchNotes = (query: string): Note[] => {
    if (!query.trim()) return notes;
    
    const lowerCaseQuery = query.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(lowerCaseQuery) ||
        note.content.toLowerCase().includes(lowerCaseQuery)
    );
  };
  
  const getChildNotes = (parentId: string): Note[] => {
    return notes.filter(note => note.parentId === parentId);
  };
  
  const getRootNotes = (): Note[] => {
    return notes.filter(note => !note.parentId);
  };
  
  const getNoteHierarchy = (startId?: string): Note[] => {
    const startNotes = startId 
      ? notes.filter(note => note.parentId === startId)
      : notes.filter(note => !note.parentId);
    
    return startNotes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };
  
  const moveNote = async (noteId: string, newParentId: string | null): Promise<void> => {
    if (!user) throw new Error("You must be logged in to move notes");
    
    setIsLoading(true);
    try {
      const noteToMove = notes.find(note => note.id === noteId);
      
      if (!noteToMove) {
        throw new Error("Note not found");
      }
      
      let updatedNotes = [...notes];
      if (noteToMove.parentId) {
        const oldParentIndex = updatedNotes.findIndex(note => note.id === noteToMove.parentId);
        if (oldParentIndex !== -1) {
          const oldParent = {...updatedNotes[oldParentIndex]};
          oldParent.children = oldParent.children?.filter(id => id !== noteId) || [];
          updatedNotes[oldParentIndex] = oldParent;
        }
      }
      
      if (newParentId) {
        const newParentIndex = updatedNotes.findIndex(note => note.id === newParentId);
        if (newParentIndex !== -1) {
          const newParent = {...updatedNotes[newParentIndex]};
          
          if (!newParent.isNotebook) {
            newParent.isNotebook = true;
          }
          
          newParent.children = newParent.children || [];
          newParent.children.push(noteId);
          updatedNotes[newParentIndex] = newParent;
        }
      }
      
      const noteIndex = updatedNotes.findIndex(note => note.id === noteId);
      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        parentId: newParentId || undefined,
      };
      
      setNotes(updatedNotes);
      toast.success("Note moved successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to move note");
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        error,
        createNote,
        createNotebook,
        updateNote,
        deleteNote,
        getNote,
        searchNotes,
        getChildNotes,
        getRootNotes,
        getNoteHierarchy,
        moveNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
