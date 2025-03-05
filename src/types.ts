
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  filePath?: string; // Optional field for file path
  parentId?: string; // Optional parent note ID for nested structure
  isNotebook?: boolean; // Whether this note is a parent notebook
  children?: string[]; // Array of child note IDs
  level?: number; // Nesting level (0 for root, 1 for first level, etc.)
  icon?: string; // Optional icon for the note
  coverImage?: string; // Optional cover image
  tags?: string[]; // Optional tags for categorization
  gender?: "male" | "female" | "other"; // Gender for training
  isTemplate?: boolean; // Whether this note is a template
  lastEditedBy?: string; // Last user to edit the note
  emoji?: string; // Emoji icon for the note
  isArchived?: boolean; // Whether this note is archived
  isStarred?: boolean; // Whether this note is starred/favorited
  collaborators?: string[]; // Array of user IDs who can edit this note
  blocks?: ContentBlock[]; // Array of content blocks for block-based editing
}

export interface TableBlock {
  id: string;
  rows: string[][];
  headers: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface MathBlock {
  id: string;
  formula: string;
  rendered?: string;
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  output?: string;
}

export interface ImageBlock {
  id: string;
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface DividerBlock {
  id: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface EmbedBlock {
  id: string;
  url: string;
  type: 'video' | 'website' | 'audio' | 'file';
  title?: string;
  thumbnail?: string;
}

export interface CalloutBlock {
  id: string;
  emoji?: string;
  content: string;
  color?: string;
}

// These types would be used when implementing block-based editing
export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 
        'numberedList' | 'checkbox' | 'table' | 'code' | 'quote' | 'image' |
        'math' | 'divider' | 'embed' | 'callout' | 'audio' | 'video' | 'file';
  content: string | TableBlock | ChecklistItem[] | string[] | MathBlock | 
           CodeBlock | ImageBlock | DividerBlock | EmbedBlock | CalloutBlock;
  position?: number; // Order of the block within the note
  createdAt?: string;
  updatedAt?: string;
  isSelected?: boolean; // Whether the block is currently selected
}

export interface BlockOperation {
  type: 'add' | 'update' | 'delete' | 'move';
  blockId?: string;
  blockType?: string;
  content?: any;
  position?: number;
  newPosition?: number;
}

export interface TrainingSettings {
  gender: "male" | "female";
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
}
