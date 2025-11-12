import React from "react";

/**
 * Parse simple markdown to React elements
 * Supports:
 * - **bold text**
 * - *italic text* or _italic text_
 * - * bullet points
 * - [link text](url)
 * - Line breaks
 */
export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Handle bullet points
    if (trimmedLine.match(/^[*\-•]\s+(.+)/)) {
      const content = trimmedLine.replace(/^[*\-•]\s+/, "");
      const parsedContent = parseInlineMarkdown(content);

      if (!inList) {
        inList = true;
        listItems = [];
      }

      listItems.push(
        <li key={`li-${lineIndex}`} className="mb-1">
          {parsedContent}
        </li>
      );
    } else {
      // If we were in a list, close it
      if (inList) {
        elements.push(
          <ul key={`ul-${lineIndex}`} className="list-disc list-inside mb-3 space-y-1">
            {listItems}
          </ul>
        );
        inList = false;
        listItems = [];
      }

      // Handle empty lines
      if (trimmedLine === "") {
        elements.push(<br key={`br-${lineIndex}`} />);
      } else {
        // Handle normal paragraphs
        const parsedContent = parseInlineMarkdown(trimmedLine);
        elements.push(
          <p key={`p-${lineIndex}`} className="mb-2 last:mb-0">
            {parsedContent}
          </p>
        );
      }
    }
  });

  // Close any remaining list
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="ul-final" className="list-disc list-inside mb-3 space-y-1">
        {listItems}
      </ul>
    );
  }

  return <div className="markdown-content">{elements}</div>;
}

/**
 * Parse inline markdown (bold, italic, links)
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let key = 0;

  // Regex patterns
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, type: "bold" }, // **bold**
    { regex: /\*(.+?)\*/g, type: "italic" }, // *italic*
    { regex: /_(.+?)_/g, type: "italic" }, // _italic_
    { regex: /\[(.+?)\]\((.+?)\)/g, type: "link" }, // [text](url)
  ];

  // Find all matches
  const matches: Array<{
    index: number;
    length: number;
    content: string;
    url?: string;
    type: string;
  }> = [];

  patterns.forEach((pattern) => {
    const regex = new RegExp(pattern.regex.source, "g");
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (pattern.type === "link") {
        matches.push({
          index: match.index,
          length: match[0].length,
          content: match[1],
          url: match[2],
          type: pattern.type,
        });
      } else {
        matches.push({
          index: match.index,
          length: match[0].length,
          content: match[1],
          type: pattern.type,
        });
      }
    }
  });

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (prefer bold over italic)
  const filteredMatches = matches.filter((match, i) => {
    for (let j = 0; j < i; j++) {
      const prevMatch = matches[j];
      if (
        match.index >= prevMatch.index &&
        match.index < prevMatch.index + prevMatch.length
      ) {
        return false;
      }
    }
    return true;
  });

  // Build parts
  filteredMatches.forEach((match) => {
    // Add text before match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }

    // Add matched element
    if (match.type === "bold") {
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold">
          {match.content}
        </strong>
      );
    } else if (match.type === "italic") {
      parts.push(
        <em key={`italic-${key++}`} className="italic">
          {match.content}
        </em>
      );
    } else if (match.type === "link") {
      parts.push(
        <a
          key={`link-${key++}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 underline hover:text-primary-700"
        >
          {match.content}
        </a>
      );
    }

    currentIndex = match.index + match.length;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
