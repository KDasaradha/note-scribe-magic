
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, MoreHorizontal, FileText } from "lucide-react";
import { Note } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModernNotebookCardProps {
  notebook: Note;
  childNotes: Note[];
}

export function ModernNotebookCard({ notebook, childNotes }: ModernNotebookCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/editor/${notebook.id}`);
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
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5">
          <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {childNotes.length} {childNotes.length === 1 ? 'page' : 'pages'}
          </span>
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
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Add Page</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
        {notebook.title}
      </h3>
      
      {notebook.content && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {notebook.content.replace(/[#*`]/g, '').trim()}
        </p>
      )}

      {/* Recent Pages Preview */}
      {childNotes.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Recent Pages
          </div>
          <div className="space-y-1">
            {childNotes.slice(0, 2).map((child) => (
              <div key={child.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <FileText className="h-3 w-3" />
                <span className="truncate">{child.title}</span>
              </div>
            ))}
            {childNotes.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{childNotes.length - 2} more pages
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(notebook.updatedAt), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
}
