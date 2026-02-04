import { useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      return stored || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? 0;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      });

      // Set CSS custom properties for the animation origin
      document.documentElement.style.setProperty("--x", `${x}px`);
      document.documentElement.style.setProperty("--y", `${y}px`);
      document.documentElement.style.setProperty("--r", `${endRadius}px`);
    } else {
      // Fallback for browsers without View Transitions API
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }
  }, []);

  return { theme, toggleTheme, setTheme };
};
