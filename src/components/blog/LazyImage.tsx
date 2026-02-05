import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt?: string;
  caption?: string;
  onClick?: () => void;
  className?: string;
}

export const LazyImage = ({ src, alt, caption, onClick, className }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative rounded-md my-6 overflow-hidden",
        !isLoaded && "bg-muted",
        className
      )}
    >
      {/* Placeholder - only show when not loaded */}
      {!isLoaded && (
        <div className="aspect-video w-full animate-pulse bg-muted flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground/30"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onClick={onClick}
          className={cn(
            "w-full cursor-zoom-in hover:opacity-90 transition-opacity duration-300",
            isLoaded ? "opacity-100 block" : "opacity-0 absolute inset-0"
          )}
        />
      )}
      
      {/* Caption */}
      {caption && (
        <p className="text-center text-sm text-muted-foreground mt-3 italic">
          {caption}
        </p>
      )}
    </div>
  );
};
