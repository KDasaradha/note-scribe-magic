
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
      className="notebook-paper relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[25px] bg-red-100 border-r border-red-200"></div>
      <div className="notebook-holes">
        <div className="notebook-hole"></div>
        <div className="notebook-hole"></div>
        <div className="notebook-hole"></div>
      </div>
      <CardHeader className="pb-2 pl-10 border-b border-slate-200">
        <CardTitle className="line-clamp-1 text-lg font-medium text-blue-900">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 pt-3 pl-10">
        <p className="text-muted-foreground text-sm line-clamp-3 notebook-text">{contentPreview}</p>
      </CardContent>
      <CardFooter className="text-xs text-blue-700 pt-0 pb-3 pl-10 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary/50"></span>
        Updated {formattedDate}
      </CardFooter>
    </Card>
  );
}
