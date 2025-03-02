
import { Note } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/editor/${note.id}`);
  };
  
  // Format content preview (first 100 characters)
  const contentPreview = note.content
    ? note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "")
    : "No content";
  
  // Format the date
  const formattedDate = note.updatedAt 
    ? formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
    : "just now";
  
  return (
    <Card 
      className="note-card overflow-hidden cursor-pointer border border-border/50 bg-card/80 backdrop-blur-sm"
      onClick={handleClick}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-card to-background/80 border-b border-border/10">
        <CardTitle className="line-clamp-1 text-lg font-medium">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-3">
        <p className="text-muted-foreground text-sm line-clamp-3">{contentPreview}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0 pb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary/50"></span>
        Updated {formattedDate}
      </CardFooter>
    </Card>
  );
}
