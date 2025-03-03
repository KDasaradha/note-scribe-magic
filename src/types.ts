
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
}
