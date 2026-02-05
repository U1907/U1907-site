import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TopBar } from "@/components/blog/TopBar";
import { loadMarkdownPosts, type BlogPost } from "@/data/blogPosts";
import { TagBadge } from "@/components/blog/TagBadge";
import { ArrowLeft, FileText } from "lucide-react";

const TagsPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(tag || null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const loadedPosts = await loadMarkdownPosts();
        setPosts(loadedPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Update selected tag when URL changes
  useEffect(() => {
    setSelectedTag(tag || null);
  }, [tag]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(t => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts by selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

  const handleTagClick = (clickedTag: string) => {
    if (selectedTag === clickedTag) {
      setSelectedTag(null);
      navigate("/tags");
    } else {
      setSelectedTag(clickedTag);
      navigate(`/tags/${encodeURIComponent(clickedTag)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar showMenuButton={false} showTagsLink />
      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-background">
        <div className="max-w-[700px] mx-auto">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            {selectedTag ? `Posts tagged "${selectedTag}"` : "All Tags"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {selectedTag
              ? `${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""} found`
              : `Browse posts by tag`}
          </p>

          {/* Tags cloud */}
          <div className="flex flex-wrap gap-2 mb-10">
            {allTags.map((t) => (
              <TagBadge
                key={t}
                tag={t}
                onClick={() => handleTagClick(t)}
                isActive={selectedTag === t}
              />
            ))}
          </div>

          {/* Posts list */}
          {loading ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : (
            <ul className="space-y-1">
              {filteredPosts.map((post, index) => (
                <li
                  key={post.id}
                  className="animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={`/blog/${post.id}`}
                    className="group flex items-start gap-3 py-4 border-b border-border hover:border-muted-foreground/30 transition-colors"
                  >
                    <FileText className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground group-hover:text-muted-foreground transition-colors font-medium block">
                        {post.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {post.date && (
                          <span className="text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span className="text-muted-foreground/50">·</span>
                            <span className="text-xs text-muted-foreground">
                              {post.tags.slice(0, 3).join(", ")}
                              {post.tags.length > 3 && ` +${post.tags.length - 3}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {filteredPosts.length === 0 && !loading && (
            <p className="text-muted-foreground text-center py-8">
              No posts found with this tag.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TagsPage;
