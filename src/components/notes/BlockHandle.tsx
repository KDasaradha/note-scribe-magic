
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Copy
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface BlockHandleProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onInsertBelow: (type: string) => void;
  dragHandleRef?: React.RefObject<HTMLDivElement>;
}

export function BlockHandle({
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  onInsertBelow,
  dragHandleRef
}: BlockHandleProps) {
  return (
    <div className="drag-handle" ref={dragHandleRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-1 hover:bg-muted rounded-sm">
              <GripVertical className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Drag to reorder</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="absolute left-full ml-1 flex flex-col gap-0.5 bg-background border border-border rounded-md shadow-sm p-0.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onMoveUp}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Move up</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onMoveDown}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Move down</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onDuplicate}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Duplicate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-48 p-2">
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('text')}
              >
                Text
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('heading')}
              >
                Heading
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('list')}
              >
                List
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('checkbox')}
              >
                Checkbox
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('table')}
              >
                Table
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('code')}
              >
                Code
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('image')}
              >
                Image
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 justify-start px-2"
                onClick={() => onInsertBelow('divider')}
              >
                Divider
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-destructive hover:text-destructive" 
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
