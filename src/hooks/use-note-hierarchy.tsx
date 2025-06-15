
import { useNotes } from "./use-notes";
import { Note } from "@/types";

export const useNoteHierarchy = () => {
  const { notes, getNote } = useNotes();

  const buildParentChain = (note: Note | undefined, chain: Note[] = []): Note[] => {
    if (!note || !note.parentId) return chain;
    
    const parentNote = getNote(note.parentId);
    if (!parentNote) return chain;
    
    return buildParentChain(parentNote, [parentNote, ...chain]);
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

  const getNotebooksWithChildren = () => {
    const rootNotes = getRootNotes();
    const notebooks = rootNotes.filter(note => note.isNotebook);
    
    return notebooks.map(notebook => ({
      notebook,
      children: getChildNotes(notebook.id)
    }));
  };

  return {
    buildParentChain,
    getChildNotes,
    getRootNotes,
    getNoteHierarchy,
    getNotebooksWithChildren,
  };
};
