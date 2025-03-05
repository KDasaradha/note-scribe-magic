
import { useState, useRef } from "react";
import { ContentBlock, ImageBlock } from "@/types";
import { BlockHandle } from "./BlockHandle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NotionBlockProps {
  block: ContentBlock;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onInsertBelow: (id: string, type: string) => void;
  onContentChange: (id: string, content: any) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function NotionBlock({
  block,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  onInsertBelow,
  onContentChange,
  isSelected,
  onSelect,
}: NotionBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  
  const handleClick = () => {
    onSelect(block.id);
  };
  
  // Basic Markdown parser for preview
  const renderContent = () => {
    if (typeof block.content === 'string') {
      let displayContent = block.content;
      
      // Add markdown handling based on block type
      switch (block.type) {
        case 'heading1':
          return <h1 className="text-3xl font-bold">{displayContent}</h1>;
        case 'heading2':
          return <h2 className="text-2xl font-bold">{displayContent}</h2>;
        case 'heading3':
          return <h3 className="text-xl font-bold">{displayContent}</h3>;
        case 'bulletList':
          return (
            <ul className="list-disc pl-6">
              {displayContent.split('\n').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        case 'numberedList':
          return (
            <ol className="list-decimal pl-6">
              {displayContent.split('\n').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        case 'quote':
          return <blockquote className="border-l-4 border-muted pl-4 italic">{displayContent}</blockquote>;
        case 'paragraph':
        default:
          return <p>{displayContent}</p>;
      }
    } else if (block.type === 'table' && 'rows' in block.content) {
      // Table block
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {block.content.headers.map((header, i) => (
                <th key={i} className="border border-border p-2 bg-muted">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.content.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-border p-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (block.type === 'checkbox' && Array.isArray(block.content)) {
      // Checkbox block
      return (
        <div>
          {block.content.map((item, i) => (
            <div key={i} className="flex items-start gap-2 my-1">
              <input 
                type="checkbox" 
                checked={item.checked} 
                className="mt-1" 
                readOnly 
              />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      );
    } else if (block.type === 'image' && 'url' in block.content) {
      // Image block
      const imageContent = block.content as ImageBlock;
      return (
        <figure>
          <img 
            src={imageContent.url} 
            alt={imageContent.caption || 'Image'} 
            className="max-w-full h-auto rounded-md" 
          />
          {imageContent.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {imageContent.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    
    // Fallback for any other block type
    return <div>Unsupported block type</div>;
  };
  
  const blockClassName = `notion-block p-2 rounded-md my-1 ${
    isSelected ? 'bg-muted' : isHovered ? 'bg-muted/40' : ''
  }`;
  
  return (
    <div
      ref={blockRef}
      className={blockClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {(isHovered || isSelected) && (
        <BlockHandle
          dragHandleRef={dragHandleRef}
          onMoveUp={() => onMoveUp(block.id)}
          onMoveDown={() => onMoveDown(block.id)}
          onDelete={() => onDelete(block.id)}
          onDuplicate={() => onDuplicate(block.id)}
          onInsertBelow={(type) => onInsertBelow(block.id, type)}
        />
      )}
      
      <div className="pl-2">
        {renderContent()}
      </div>
      
      {/* Add block button that appears between blocks */}
      {isHovered && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-muted border border-border shadow-sm hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onInsertBelow(block.id, 'text');
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
