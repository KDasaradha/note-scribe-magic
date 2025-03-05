
// Advanced Markdown utilities for Notion-like functionality

// Sample math expressions
export const mathExpressions = {
  quadratic: "f(x) = ax^2 + bx + c",
  integral: "\\int_{a}^{b} f(x) \\, dx",
  matrix: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
  sum: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
};

// Helper to identify block types
export const identifyBlockType = (line: string): string => {
  if (line.startsWith('# ')) return 'heading1';
  if (line.startsWith('## ')) return 'heading2';
  if (line.startsWith('### ')) return 'heading3';
  if (line.startsWith('- ') || line.startsWith('* ')) return 'list';
  if (line.startsWith('1. ')) return 'orderedList';
  if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) return 'checklist';
  if (line.startsWith('```')) return 'code';
  if (line.startsWith('> ')) return 'quote';
  if (line.startsWith('|') && line.includes('|') && line.endsWith('|')) return 'table';
  if (line.startsWith('$$') || line.endsWith('$$')) return 'math';
  if (line.startsWith('---')) return 'divider';
  return 'paragraph';
};

// Function to parse markdown into block structure
export const parseMarkdownToBlocks = (markdown: string): any[] => {
  const lines = markdown.split('\n');
  const blocks: any[] = [];
  let currentBlock: any = null;
  
  lines.forEach((line, index) => {
    const type = identifyBlockType(line);
    
    // Handle code blocks separately
    if (type === 'code') {
      if (!currentBlock || currentBlock.type !== 'code') {
        currentBlock = { id: `block-${index}`, type: 'code', content: [] };
        blocks.push(currentBlock);
      } else {
        currentBlock = null;
      }
      return;
    }
    
    // Handle table blocks
    if (type === 'table') {
      if (!currentBlock || currentBlock.type !== 'table') {
        currentBlock = { 
          id: `block-${index}`, 
          type: 'table', 
          content: { rows: [line], headers: [] } 
        };
        blocks.push(currentBlock);
      } else {
        currentBlock.content.rows.push(line);
      }
      return;
    }
    
    // Handle normal blocks
    if (currentBlock && currentBlock.type === type) {
      if (typeof currentBlock.content === 'string') {
        currentBlock.content += '\n' + line;
      } else {
        currentBlock.content.push(line);
      }
    } else {
      currentBlock = { id: `block-${index}`, type, content: line };
      blocks.push(currentBlock);
    }
  });
  
  return blocks;
};

// Function to enhance markdown with Notion-like features
export const enhanceMarkdown = (markdown: string): string => {
  let enhanced = markdown;
  
  // Convert Notion-style checkboxes to markdown checkboxes
  enhanced = enhanced.replace(/- \[ \]/g, '- [ ]');
  enhanced = enhanced.replace(/- \[x\]/g, '- [x]');
  
  // Add support for centering text
  enhanced = enhanced.replace(/<center>(.*?)<\/center>/g, '<div style="text-align: center">$1</div>');
  
  // Add support for right alignment
  enhanced = enhanced.replace(/<right>(.*?)<\/right>/g, '<div style="text-align: right">$1</div>');
  
  // Add divider enhancement
  enhanced = enhanced.replace(/^---$/gm, '<hr class="my-4 border-t border-border" />');
  
  return enhanced;
};

// Generate template for various block types
export const getBlockTemplate = (type: string): string => {
  switch (type) {
    case 'table':
      return `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;
    
    case 'code':
      return "```javascript\n// Your code here\nconsole.log('Hello, world!');\n```";
    
    case 'math':
      return `$$
${mathExpressions.quadratic}
$$`;
    
    case 'divider':
      return "---";
    
    case 'checklist':
      return "- [ ] Task 1\n- [ ] Task 2\n- [x] Completed task";
    
    default:
      return "";
  }
};

// Function to move blocks in the markdown
export const moveMarkdownBlock = (markdown: string, direction: 'up' | 'down', lineIndex: number): string => {
  const lines = markdown.split('\n');
  
  if (direction === 'up' && lineIndex > 0) {
    [lines[lineIndex], lines[lineIndex - 1]] = [lines[lineIndex - 1], lines[lineIndex]];
  } else if (direction === 'down' && lineIndex < lines.length - 1) {
    [lines[lineIndex], lines[lineIndex + 1]] = [lines[lineIndex + 1], lines[lineIndex]];
  }
  
  return lines.join('\n');
};
