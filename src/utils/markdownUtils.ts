
// Sample markdown content for learning
export const markdownGuide = `# Markdown Guide

## Basic Syntax

### Headings
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Formatting Text
**Bold text** or __Bold text__
*Italic text* or _Italic text_
~~Strikethrough~~
**Bold and _nested italic_**
***All bold and italic***

### Lists
#### Ordered Lists
1. First item
2. Second item
3. Third item

#### Unordered Lists
- First item
- Second item
- Third item

### Links
[Visit OpenAI](https://www.openai.com)
[Internal Link to Dashboard](#dashboard)

### Images
![Alt text for image](https://picsum.photos/200/100)

### Blockquotes
> This is a blockquote
> 
> It can span multiple lines

### Code
Inline \`code\` spans

\`\`\`javascript
// Code blocks
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Horizontal Rules
---

## Extended Syntax

### Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Footnotes
Here's a sentence with a footnote. [^1]

[^1]: This is the footnote.

### Emoji
:smile: :heart: :thumbsup:

### Highlighting
==Highlighted text==

### Subscript and Superscript
H~2~O (subscript)
X^2^ (superscript)
`;

// Function to export markdown as .md file
export const exportMarkdownToFile = (content: string, fileName: string = "note") => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
