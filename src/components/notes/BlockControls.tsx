
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  GripVertical, 
  MoreHorizontal,
  Trash,
  Copy,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlockControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddBlockBelow: () => void;
  showMoveUp: boolean;
  showMoveDown: boolean;
}

export function BlockControls({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAddBlockBelow,
  showMoveUp = true,
  showMoveDown = true,
}: BlockControlsProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="absolute -left-14 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-full flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className={`flex flex-col gap-1 bg-card border border-border rounded-md p-1 shadow-md ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={onAddBlockBelow}
          title="Add block below"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 cursor-grab active:cursor-grabbing" 
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        
        {showMoveUp && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={onMoveUp}
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
        
        {showMoveDown && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={onMoveDown}
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
