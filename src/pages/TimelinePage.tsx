import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "@/components/blog/TopBar";
import { Footer } from "@/components/Footer";
import { loadMarkdownPosts, type BlogPost } from "@/data/blogPosts";
import { Rss } from "lucide-react";

interface PostsByYear {
  [year: string]: BlogPost[];
}

const TimelinePage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Parse dates and group by year
  const postsByYear = useMemo(() => {
    const sortedPosts = [...posts].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Sort by date descending
    });

    return sortedPosts.reduce((acc, post) => {
      const year = post.date ? new Date(post.date).getFullYear().toString() : "Unknown";
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    }, {} as PostsByYear);
  }, [posts]);

  // Get years sorted descending
  const years = Object.keys(postsByYear).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return parseInt(b) - parseInt(a);
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar showMenuButton={false} showTimelineLink={false} showTagsLink />
      
      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[640px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Archive
              </h1>
              <span className="text-muted-foreground/70 text-base">
                {posts.length} posts
              </span>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/50 hover:text-foreground transition-colors ml-auto"
                title="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : (
            <div className="space-y-10">
              {years.map((year) => (
                <section key={year}>
                  <h2 className="text-base font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">
                    {year}
                  </h2>
                  <ul className="space-y-0">
                    {postsByYear[year].map((post, index) => (
                      <li
                        key={post.id}
                        className="animate-fade-in opacity-0"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <Link
                          to={`/blog/${post.id}`}
                          className="group flex items-baseline py-2.5 border-b border-border/50 hover:border-muted-foreground/30 transition-colors"
                        >
                          <span className="text-base text-muted-foreground/60 font-mono w-20 shrink-0">
                            {formatDate(post.date)}
                          </span>
                          <span className="text-base text-foreground group-hover:text-muted-foreground transition-colors">
                            {post.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TimelinePage;
