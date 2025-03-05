
import { useCallback, ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
  Heading1,
  Heading2,
  Heading3,
  Table,
  List,
  ListOrdered,
  CheckSquare,
  Image,
  Code,
  Quote,
  Copy,
  Trash,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DivideSquare,
  Underline,
  Link,
  MoveVertical,
  RotateCcw,
  RotateCw,
  FileUp,
  FileDown,
  Calculator,
  BookOpen,
} from "lucide-react";

interface NoteContextMenuProps {
  children: ReactNode;
  onInsertMarkdown: (type: string) => void;
  onCopySelection: () => void;
  onDeleteSelection: () => void;
}

export function NoteContextMenu({
  children,
  onInsertMarkdown,
  onCopySelection,
  onDeleteSelection,
}: NoteContextMenuProps) {
  const handleInsert = useCallback((type: string) => {
    onInsertMarkdown(type);
  }, [onInsertMarkdown]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => handleInsert("heading1")} className="gap-2">
          <Heading1 className="h-4 w-4" />
          Heading 1
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("heading2")} className="gap-2">
          <Heading2 className="h-4 w-4" />
          Heading 2
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("heading3")} className="gap-2">
          <Heading3 className="h-4 w-4" />
          Heading 3
        </ContextMenuItem>
        <ContextMenuSeparator />
        
        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <Bold className="h-4 w-4" />
            Formatting
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => handleInsert("bold")} className="gap-2">
              <Bold className="h-4 w-4" />
              Bold
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleInsert("italic")} className="gap-2">
              <Italic className="h-4 w-4" />
              Italic
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleInsert("underline")} className="gap-2">
              <Underline className="h-4 w-4" />
              Underline
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleInsert("alignLeft")} className="gap-2">
              <AlignLeft className="h-4 w-4" />
              Align Left
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleInsert("alignCenter")} className="gap-2">
              <AlignCenter className="h-4 w-4" />
              Align Center
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleInsert("alignRight")} className="gap-2">
              <AlignRight className="h-4 w-4" />
              Align Right
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleInsert("list")} className="gap-2">
          <List className="h-4 w-4" />
          Bullet List
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("orderedList")} className="gap-2">
          <ListOrdered className="h-4 w-4" />
          Numbered List
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("checklist")} className="gap-2">
          <CheckSquare className="h-4 w-4" />
          Checklist
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleInsert("table")} className="gap-2">
          <Table className="h-4 w-4" />
          Table
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("code")} className="gap-2">
          <Code className="h-4 w-4" />
          Code Block
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("quote")} className="gap-2">
          <Quote className="h-4 w-4" />
          Quote
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("math")} className="gap-2">
          <Calculator className="h-4 w-4" />
          Math Formula
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("divider")} className="gap-2">
          <DivideSquare className="h-4 w-4" />
          Divider
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleInsert("image")} className="gap-2">
          <Image className="h-4 w-4" />
          Image
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("link")} className="gap-2">
          <Link className="h-4 w-4" />
          Link
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleInsert("moveUp")} className="gap-2">
          <FileUp className="h-4 w-4" />
          Move Block Up
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleInsert("moveDown")} className="gap-2">
          <FileDown className="h-4 w-4" />
          Move Block Down
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onCopySelection} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={onDeleteSelection} 
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash className="h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
