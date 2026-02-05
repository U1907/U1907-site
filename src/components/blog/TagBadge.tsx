import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
  size?: "sm" | "md";
}

export const TagBadge = ({ tag, onClick, href, isActive, size = "md" }: TagBadgeProps) => {
  const className = cn(
    "inline-flex items-center rounded-md font-normal transition-colors !no-underline decoration-transparent",
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
    (onClick || href) && "cursor-pointer",
    isActive
      ? "bg-muted text-foreground"
      : "bg-muted/30 text-muted-foreground/70 hover:bg-muted/50 hover:text-muted-foreground"
  );

  if (href) {
    return (
      <Link to={href} className={className} style={{ textDecoration: 'none' }}>
        {tag}
      </Link>
    );
  }
  
  const Component = onClick ? "button" : "span";
  
  return (
    <Component onClick={onClick} className={className}>
      {tag}
    </Component>
  );
};

interface TagListProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  linkToTagPage?: boolean;
  activeTag?: string;
  size?: "sm" | "md";
  className?: string;
}

export const TagList = ({ tags, onTagClick, linkToTagPage, activeTag, size = "md", className }: TagListProps) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
          href={linkToTagPage ? `/tags/${encodeURIComponent(tag)}` : undefined}
          isActive={activeTag === tag}
          size={size}
        />
      ))}
    </div>
  );
};
