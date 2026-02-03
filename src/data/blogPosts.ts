export interface ContentBlock {
  type: "paragraph" | "heading" | "code" | "list" | "ordered-list" | "blockquote" | "divider" | "inline-code";
  content?: string;
  level?: 1 | 2 | 3;
  language?: string;
  filename?: string;
  items?: string[];
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
