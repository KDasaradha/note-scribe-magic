
import { useNavigate } from "react-router-dom";
import { FileText, Clock, MoreHorizontal } from "lucide-react";
import { Note } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModernNoteCardProps {
  note: Note;
}

export function ModernNoteCard({ note }: ModernNoteCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/editor/${note.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all duration-200"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5">
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={handleMenuClick}>
            <Button
              variant="ghost" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Move</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
        {note.title}
      </h3>
      
      {note.content && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {note.content.replace(/[#*`]/g, '').trim()}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(note.updatedAt), 'MMM d, yyyy')}
        </div>
        <div className="text-right">
          {note.content ? `${note.content.length} chars` : 'Empty'}
        </div>
      </div>
    </div>
  );
}
