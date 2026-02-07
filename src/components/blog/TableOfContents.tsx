import { useState, useEffect, useMemo } from "react";
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
  const isScrollingRef = { current: false };

  // Extract headings from content
  const headings: TOCItem[] = content
    .filter((block) => block.type === "heading" && block.level && block.level <= 3)
    .map((block) => ({
      id: generateId(block.content || ""),
      text: block.content || "",
      level: block.level || 2,
    }));

  // Group headings: h2 as parents with h3 children
  const groupedHeadings = useMemo(() => {
    const groups: { parent: TOCItem; children: TOCItem[] }[] = [];
    let currentGroup: { parent: TOCItem; children: TOCItem[] } | null = null;

    headings.forEach((heading) => {
      if (heading.level === 2) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { parent: heading, children: [] };
      } else if (heading.level === 3 && currentGroup) {
        currentGroup.children.push(heading);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [headings]);

  // Find which parent section is active
  const activeParentId = useMemo(() => {
    for (const group of groupedHeadings) {
      if (group.parent.id === activeId) return group.parent.id;
      for (const child of group.children) {
        if (child.id === activeId) return group.parent.id;
      }
    }
    return groupedHeadings[0]?.parent.id || "";
  }, [activeId, groupedHeadings]);

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Skip scroll handling during programmatic scroll
      if (isScrollingRef.current) return;

      const headingElements = headings
        .map(({ id }) => ({ id, element: document.getElementById(id) }))
        .filter((item): item is { id: string; element: HTMLElement } => item.element !== null);

      if (headingElements.length === 0) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isAtBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      let activeHeadingId = headingElements[0].id;
      
      for (const { id, element } of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 160) {
          activeHeadingId = id;
        }
      }

      setActiveId(activeHeadingId);
    };

    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    const scrollContainer = document.querySelector("main");
    if (element && scrollContainer) {
      isScrollingRef.current = true;
      setActiveId(id);
      
      // Calculate target position relative to the scroll container
      const elementRect = element.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetScrollTop = scrollContainer.scrollTop + elementRect.top - containerRect.top - 80;
      
      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
      
      // Re-enable scroll handling after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
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
          {groupedHeadings.map((group, groupIndex) => {
            const isExpanded = activeParentId === group.parent.id;
            
            return (
              <li 
                key={group.parent.id}
                className="animate-fade-in"
                style={{ animationDelay: `${groupIndex * 60}ms`, animationFillMode: 'both' }}
              >
                {/* Parent heading (h2) */}
                <button
                  onClick={() => handleClick(group.parent.id)}
                  className={cn(
                    "block w-full text-left text-[13px] py-1.5 pl-4 border-l-2 -ml-px",
                    "transition-all duration-200 ease-out",
                    "truncate",
                    activeId === group.parent.id
                      ? "border-foreground text-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                  )}
                  title={group.parent.text}
                >
                  {group.parent.text}
                </button>

                {/* Child headings (h3) - only show when section is active */}
                {group.children.length > 0 && (
                  <ul
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-out",
                      isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {group.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => handleClick(child.id)}
                          className={cn(
                            "block w-full text-left text-[12.5px] py-1 pl-7 border-l-2 -ml-px",
                            "transition-all duration-200 ease-out",
                            "truncate",
                            activeId === child.id
                              ? "border-foreground text-foreground font-medium"
                              : "border-transparent text-muted-foreground/80 hover:text-foreground hover:border-muted-foreground/50"
                          )}
                          title={child.text}
                        >
                          {child.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
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
