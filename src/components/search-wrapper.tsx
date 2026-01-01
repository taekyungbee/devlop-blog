"use client";

import { useEffect, useState } from "react";
import { Search } from "@/components/search";

interface SearchablePost {
  slug: string;
  title: string;
  description?: string | null;
}

export function SearchWrapper() {
  const [posts, setPosts] = useState<SearchablePost[]>([]);

  useEffect(() => {
    fetch("/api/posts/search")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  return <Search posts={posts} />;
}
