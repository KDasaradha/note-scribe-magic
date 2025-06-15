
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import { Note } from "@/types";
import { format } from "date-fns";

interface ModernNotebookCardProps {
  notebook: Note;
  childNotes: Note[];
}

export function ModernNotebookCard({ notebook, childNotes }: ModernNotebookCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 cursor-pointer transition-all duration-200 group"
      onClick={() => navigate(`/editor/${notebook.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-blue-600 rounded-lg p-2">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs text-gray-400">
          {childNotes.length} pages
        </span>
      </div>
      
      <h3 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
        {notebook.title}
      </h3>
      
      {notebook.content && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {notebook.content}
        </p>
      )}
      
      <div className="flex items-center text-xs text-gray-500">
        <Clock className="h-3 w-3 mr-1" />
        Updated {format(new Date(notebook.updatedAt), 'M/d/yyyy')}
      </div>
    </div>
  );
}
