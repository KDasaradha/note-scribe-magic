
import { useRef } from "react";
import { toast } from "sonner";
import { exportMarkdownToFile, markdownGuide } from "@/utils/markdownUtils";

interface UseMarkdownEditorProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useMarkdownEditor = ({
  content,
  setContent,
  title,
  setTitle,
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: UseMarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (markdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText = '';
    
    switch (markdown) {
      case 'bold':
        newText = beforeText + `**${selectedText || 'bold text'}**` + afterText;
        break;
      case 'italic':
        newText = beforeText + `*${selectedText || 'italic text'}*` + afterText;
        break;
      case 'heading1':
        newText = beforeText + `\n# ${selectedText || 'Heading 1'}\n` + afterText;
        break;
      case 'heading2':
        newText = beforeText + `\n## ${selectedText || 'Heading 2'}\n` + afterText;
        break;
      case 'heading3':
        newText = beforeText + `\n### ${selectedText || 'Heading 3'}\n` + afterText;
        break;
      case 'list':
        newText = beforeText + `\n- ${selectedText || 'List item'}\n` + afterText;
        break;
      case 'orderedList':
        newText = beforeText + `\n1. ${selectedText || 'List item'}\n` + afterText;
        break;
      case 'link':
        newText = beforeText + `[${selectedText || 'Link text'}](url)` + afterText;
        break;
      case 'image':
        newText = beforeText + `![${selectedText || 'Alt text'}](image-url)` + afterText;
        break;
      case 'code':
        newText = beforeText + "\n```\n" + (selectedText || 'code here') + "\n```\n" + afterText;
        break;
      case 'quote':
        newText = beforeText + `\n> ${selectedText || 'Blockquote'}\n` + afterText;
        break;
      case 'checklist':
        newText = beforeText + `\n- [ ] ${selectedText || 'Task'}\n` + afterText;
        break;
      case 'table':
        newText = beforeText + `\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n` + afterText;
        break;
      default:
        newText = content;
    }

    setContent(newText);
    setHasUnsavedChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      const cursorPos = markdown === 'code' 
        ? beforeText.length + 5 
        : beforeText.length + markdown.length + 4;
      textarea.selectionStart = cursorPos;
      textarea.selectionEnd = cursorPos;
    }, 0);
  };

  const insertTableTemplate = () => {
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(start);
    
    setContent(beforeText + tableTemplate + afterText);
    setHasUnsavedChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tableTemplate.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const insertChecklist = () => {
    const checklistTemplate = `
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
`;
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(start);
    
    setContent(beforeText + checklistTemplate + afterText);
    setHasUnsavedChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + checklistTemplate.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const loadSampleMarkdown = () => {
    if (content && hasUnsavedChanges) {
      if (!window.confirm("Loading sample markdown will replace your current content. Continue?")) {
        return;
      }
    }
    setContent(markdownGuide);
    setTitle(title || "Markdown Guide");
    setHasUnsavedChanges(true);
    toast.success("Sample markdown loaded");
  };

  const exportToFile = () => {
    if (!content.trim()) {
      toast.error("Nothing to export - note is empty");
      return;
    }
    
    exportMarkdownToFile(content, title || "untitled-note");
    toast.success("Markdown file downloaded");
  };

  const handleCopySelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = content.substring(textarea.selectionStart, textarea.selectionEnd);
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast.success("Copied to clipboard");
    }
  };

  const handleDeleteSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const newText = content.substring(0, start) + content.substring(end);
      setContent(newText);
      setHasUnsavedChanges(true);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start;
        textarea.selectionEnd = start;
      }, 0);
    }
  };

  return {
    textareaRef,
    insertMarkdown,
    insertTableTemplate,
    insertChecklist,
    loadSampleMarkdown,
    exportToFile,
    handleCopySelection,
    handleDeleteSelection,
  };
};
