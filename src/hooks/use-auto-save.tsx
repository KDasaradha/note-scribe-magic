
import { useEffect, useRef, useState } from "react";
import { useNotes } from "./use-notes";
import { toast } from "sonner";

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

interface UseAutoSaveProps {
  noteId: string | undefined;
  title: string;
  content: string;
  isNewNote: boolean;
}

export const useAutoSave = ({ noteId, title, content, isNewNote }: UseAutoSaveProps) => {
  const { updateNote, getNote } = useNotes();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for unsaved changes
  useEffect(() => {
    if (isNewNote) {
      setHasUnsavedChanges(title.trim() !== "" || content.trim() !== "");
    } else if (noteId) {
      const existingNote = getNote(noteId);
      if (existingNote) {
        setHasUnsavedChanges(
          title !== existingNote.title || content !== existingNote.content
        );
        if (!lastSaved) {
          setLastSaved(new Date(existingNote.updatedAt));
        }
      }
    }
  }, [title, content, isNewNote, noteId, getNote, lastSaved]);

  // Auto-save logic
  useEffect(() => {
    if (hasUnsavedChanges && !isNewNote && noteId) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, title, hasUnsavedChanges, noteId, isNewNote]);

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges || isNewNote || !noteId) return;
    
    try {
      const updatedNote = await updateNote(noteId, title, content);
      setLastSaved(new Date(updatedNote.updatedAt));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    lastSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setLastSaved,
  };
};
