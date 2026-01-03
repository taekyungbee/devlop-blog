"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // DOM에서 h2, h3 추출
    const elements = document.querySelectorAll("article h2, article h3");
    const items: TocItem[] = Array.from(elements)
      .filter((el) => el.id) // ID가 있는 헤딩만
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      }));
    setHeadings(items);

    // Intersection Observer로 현재 섹션 추적
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    elements.forEach((el) => {
      if (el.id) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h2 className="font-semibold mb-4 text-sm text-foreground">목차</h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "transition-colors duration-200",
              heading.level === 3 && "ml-4"
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1 hover:text-foreground",
                activeId === heading.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
