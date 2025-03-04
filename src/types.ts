
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

// These types would be used when implementing block-based editing
export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 
        'numberedList' | 'checkbox' | 'table' | 'code' | 'quote' | 'image';
  content: string | TableBlock | ChecklistItem[] | string[];
}

export interface TrainingSettings {
  gender: "male" | "female";
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
}
