export interface ContentBlock {
  type: "paragraph" | "heading" | "code" | "list" | "ordered-list" | "blockquote" | "divider" | "inline-code" | "image" | "table" | "callout";
  content?: string;
  level?: 1 | 2 | 3;
  language?: string;
  filename?: string;
  items?: string[];
  alt?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  calloutVariant?: "note" | "tip" | "warning" | "question";
  calloutTitle?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date?: string;
  content: ContentBlock[];
}

// Re-export the markdown loader for convenience
export { loadMarkdownPosts } from "@/lib/markdown";
