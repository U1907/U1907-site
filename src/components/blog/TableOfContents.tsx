import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/data/blogPosts";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: ContentBlock[];
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from content
  const headings: TOCItem[] = content
    .filter((block) => block.type === "heading" && block.level && block.level <= 3)
    .map((block) => ({
      id: generateId(block.content || ""),
      text: block.content || "",
      level: block.level || 2,
    }));

  useEffect(() => {
    // Find the scrollable container (main element)
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const headingElements = headings
        .map(({ id }) => ({ id, element: document.getElementById(id) }))
        .filter((item): item is { id: string; element: HTMLElement } => item.element !== null);

      if (headingElements.length === 0) return;

      // Check if scrolled to bottom
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isAtBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      // Find active heading based on viewport position
      let activeHeadingId = headingElements[0].id;
      
      for (const { id, element } of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 160) {
          activeHeadingId = id;
        }
      }

      setActiveId(activeHeadingId);
    };

    // Initial check
    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:block fixed top-[140px] right-8 2xl:right-12 w-[200px]">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 animate-fade-in">
          <Menu className="w-3.5 h-3.5" />
          <span>On This Page</span>
        </div>
        <ul className="space-y-0.5 border-l border-border">
          {headings.map((heading, index) => (
            <li 
              key={heading.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "block w-full text-left text-[13px] py-1.5 border-l-2 -ml-px",
                  "transition-all duration-200 ease-out",
                  "truncate",
                  heading.level === 1 && "pl-4",
                  heading.level === 2 && "pl-4",
                  heading.level === 3 && "pl-7",
                  activeId === heading.id
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                )}
                title={heading.text}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Generate a URL-friendly ID from heading text
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export { generateId };
