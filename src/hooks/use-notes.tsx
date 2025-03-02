
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  createNote: (title: string, content: string) => Promise<Note>;
  updateNote: (id: string, title: string, content: string) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  searchNotes: (query: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Mock notes storage (would be replaced with a real database in production)
const mockNotesStorage = {
  getNotes: (userId: string): Note[] => {
    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    return allNotes.filter((note: Note) => note.userId === userId);
  },
  
  saveNotes: (notes: Note[]) => {
    // Get all notes from all users
    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    
    // Filter out notes from the current user
    const otherUsersNotes = allNotes.filter(
      (note: Note) => !notes.some(n => n.id === note.id)
    );
    
    // Save all notes back to localStorage
    localStorage.setItem("notes", JSON.stringify([...otherUsersNotes, ...notes]));
  }
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load notes when user changes
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
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (user && notes.length > 0) {
      mockNotesStorage.saveNotes(notes);
    }
  }, [notes, user]);
  
  const createNote = async (title: string, content: string): Promise<Note> => {
    if (!user) throw new Error("You must be logged in to create notes");
    
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: title || "Untitled Note",
        content: content || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
      };
      
      setNotes(prev => [...prev, newNote]);
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
  
  const updateNote = async (id: string, title: string, content: string): Promise<Note> => {
    if (!user) throw new Error("You must be logged in to update notes");
    
    setIsLoading(true);
    try {
      // Simulate network delay
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const noteExists = notes.some(note => note.id === id);
      
      if (!noteExists) {
        throw new Error("Note not found");
      }
      
      const filteredNotes = notes.filter(note => note.id !== id);
      setNotes(filteredNotes);
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
  
  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        error,
        createNote,
        updateNote,
        deleteNote,
        getNote,
        searchNotes,
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
