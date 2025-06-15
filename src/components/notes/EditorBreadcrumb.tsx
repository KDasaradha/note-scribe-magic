
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@/types";
import { Book, ChevronLeft, FileText, ArrowRight, PlusCircle, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EditorBreadcrumbProps {
  note: Note | undefined;
  parentChain: Note[];
  onCreateSubpage: () => void;
  onNoteAction: (action: string, noteId: string) => void;
  noteId: string | undefined;
}

export function EditorBreadcrumb({ note, parentChain, onCreateSubpage, onNoteAction, noteId }: EditorBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 shadow-sm">
      <div className="container max-w-7xl flex items-center justify-between">
        <div className="flex items-center flex-wrap gap-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 shrink-0"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
          
          {parentChain.length > 0 && (
            <>
              {parentChain.map((parent, index) => (
                <div key={parent.id} className="flex items-center shrink-0">
                  <span className="mx-2 text-gray-400">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/editor/${parent.id}`)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 max-w-[200px]"
                  >
                    {index === 0 ? (
                      <Book className="h-4 w-4 mr-1 shrink-0" />
                    ) : (
                      <FileText className="h-4 w-4 mr-1 shrink-0" />
                    )}
                    <span className="truncate">{parent.title}</span>
                  </Button>
                  {index < parentChain.length - 1 && (
                    <ArrowRight className="h-3 w-3 mx-2 text-gray-400 shrink-0" />
                  )}
                </div>
              ))}
              <span className="mx-2 text-gray-400">/</span>
              <div className="flex items-center min-w-0">
                {note?.isNotebook ? (
                  <Book className="h-4 w-4 mr-2 text-blue-600 shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 mr-2 text-blue-600 shrink-0" />
                )}
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {note?.title}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateSubpage}
            className="hidden sm:flex"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            New Page
          </Button>

          {note && noteId !== "new" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => onNoteAction('duplicate', note.id)}
                  className="cursor-pointer"
                >
                  Duplicate
                </DropdownMenuItem>
                {note.parentId && (
                  <DropdownMenuItem 
                    onClick={() => onNoteAction('moveToRoot', note.id)}
                    className="cursor-pointer"
                  >
                    Move to root
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onNoteAction('delete', note.id)}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onCreateSubpage}
                  className="sm:hidden cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
