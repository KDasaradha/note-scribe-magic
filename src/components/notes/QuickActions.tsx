
import { Plus, BookOpen, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface QuickActionsProps {
  onCreateNote: () => void;
  onCreateNotebook: () => void;
}

export function QuickActions({ onCreateNote, onCreateNotebook }: QuickActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={onCreateNote} className="gap-2">
        <FileText className="h-4 w-4" />
        New Note
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onCreateNote} className="gap-2">
            <FileText className="h-4 w-4" />
            Quick Note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCreateNotebook} className="gap-2">
            <BookOpen className="h-4 w-4" />
            New Notebook
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <Zap className="h-4 w-4" />
            From Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
