
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/types";
import { Book, FileText, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotebookOverviewProps {
  note: Note;
  childNotes: Note[];
  onCreateSubpage: () => void;
}

export function NotebookOverview({ note, childNotes, onCreateSubpage }: NotebookOverviewProps) {
  const navigate = useNavigate();

  return (
    <ScrollArea className="h-full">
      <div className="container max-w-6xl p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl mr-4">
              <Book className="text-blue-600 dark:text-blue-400 h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {note.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {childNotes.length} {childNotes.length === 1 ? 'page' : 'pages'} in this notebook
              </p>
            </div>
          </div>
          
          {note.content && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childNotes.map((childNote) => (
            <div 
              key={childNote.id} 
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
              onClick={() => navigate(`/editor/${childNote.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1 min-w-0">
                  {childNote.isNotebook ? (
                    <Book className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {childNote.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                {childNote.content 
                  ? childNote.content.substring(0, 120) + (childNote.content.length > 120 ? "..." : "")
                  : childNote.isNotebook ? "Notebook container" : "Empty note"}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {new Date(childNote.updatedAt).toLocaleDateString()}
                </span>
                <span className="group-hover:text-blue-600 transition-colors">
                  Open →
                </span>
              </div>
            </div>
          ))}

          <div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors min-h-[180px]"
            onClick={onCreateSubpage}
          >
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-3">
              <PlusCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Add New Page</p>
            <p className="text-blue-600 dark:text-blue-400 text-sm text-center">
              Create a new page in this notebook
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
