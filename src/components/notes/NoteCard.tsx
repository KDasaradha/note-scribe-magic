
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
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-3">{contentPreview}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        Updated {formattedDate}
      </CardFooter>
    </Card>
  );
}
