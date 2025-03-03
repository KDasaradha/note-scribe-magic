
import { Note } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Book, ChevronRight, FileText } from "lucide-react";
import { useNotes } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  isChild?: boolean;
}

export function NoteCard({ note, isChild = false }: NoteCardProps) {
  const navigate = useNavigate();
  const { getChildNotes } = useNotes();
  
  const handleClick = () => {
    navigate(`/editor/${note.id}`);
  };
  
  // Format content preview (first 100 characters)
  const contentPreview = note.content
    ? note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "")
    : note.isNotebook ? "Notebook" : "No content";
  
  // Format the date
  const formattedDate = note.updatedAt 
    ? formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
    : "just now";
  
  // Get child count if this is a notebook
  const childNotes = note.isNotebook ? getChildNotes(note.id) : [];
  const childCount = childNotes.length;
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
        note.isNotebook ? "notebook-cover bg-blue-100" : "notebook-paper",
        isChild && "border-l-4 border-l-blue-300"
      )}
      onClick={handleClick}
    >
      {!note.isNotebook && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-[25px] bg-red-100 border-r border-red-200"></div>
          <div className="notebook-holes">
            <div className="notebook-hole"></div>
            <div className="notebook-hole"></div>
            <div className="notebook-hole"></div>
          </div>
        </>
      )}
      
      <CardHeader className={cn(
        "pb-2 border-b", 
        note.isNotebook 
          ? "bg-blue-200/70 border-blue-300 flex flex-row items-center" 
          : "pl-10 border-slate-200"
      )}>
        <div className={cn(
          "flex items-center gap-2",
          note.isNotebook && "flex-1"
        )}>
          {note.isNotebook 
            ? <Book className="h-5 w-5 text-blue-700" /> 
            : <FileText className="h-4 w-4 text-blue-700" />
          }
          <CardTitle className={cn(
            "line-clamp-1 font-medium text-blue-900",
            note.isNotebook ? "text-xl" : "text-lg"
          )}>
            {note.title}
          </CardTitle>
        </div>
        
        {note.isNotebook && childCount > 0 && (
          <div className="flex items-center text-sm text-blue-700">
            <span className="mr-2">{childCount} {childCount === 1 ? 'page' : 'pages'}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      
      {(!note.isNotebook || note.content) && (
        <CardContent className={cn(
          "pb-2 pt-3", 
          note.isNotebook ? "px-4" : "pl-10"
        )}>
          <p className={cn(
            "text-sm line-clamp-3", 
            note.isNotebook ? "text-blue-800" : "notebook-text text-muted-foreground"
          )}>
            {contentPreview}
          </p>
        </CardContent>
      )}
      
      <CardFooter className={cn(
        "text-xs pt-0 pb-3 flex items-center gap-2",
        note.isNotebook ? "px-4 text-blue-800" : "pl-10 text-blue-700"
      )}>
        <span className="inline-block w-2 h-2 rounded-full bg-primary/50"></span>
        Updated {formattedDate}
      </CardFooter>
    </Card>
  );
}
