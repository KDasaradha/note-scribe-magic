
import { useNotes } from "@/hooks/use-notes";
import { NoteCard } from "./NoteCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotesList() {
  const { notes, isLoading } = useNotes();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-medium mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first note to get started
        </p>
        <Button onClick={() => navigate("/editor/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Note
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
