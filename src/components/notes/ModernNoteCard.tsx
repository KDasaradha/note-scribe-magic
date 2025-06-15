
import { useNavigate } from "react-router-dom";
import { FileText, Clock } from "lucide-react";
import { Note } from "@/types";
import { format } from "date-fns";

interface ModernNoteCardProps {
  note: Note;
}

export function ModernNoteCard({ note }: ModernNoteCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 cursor-pointer transition-all duration-200 group"
      onClick={() => navigate(`/editor/${note.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-gray-600 rounded-lg p-2">
          <FileText className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <h3 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
        {note.title}
      </h3>
      
      {note.content && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {note.content}
        </p>
      )}
      
      <div className="flex items-center text-xs text-gray-500">
        <Clock className="h-3 w-3 mr-1" />
        Updated {format(new Date(note.updatedAt), 'M/d/yyyy')}
      </div>
    </div>
  );
}
