"use client";

import { useEffect, useState } from "react";

type SearchResults = {
  products: any[];
  users: any[];
  orders: any[];
  categories: any[];
};

export function useGlobalSearch(
    role: string,
    activeTab: string,
    userId?: string
) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<SearchResults>({
    products: [],
    users: [],
    orders: [],
    categories: [],
  });

  useEffect(() => {
    if (!search.trim()) {
      setResults({
        products: [],
        users: [],
        orders: [],
        categories: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
            q: search,
            role,
            tab: activeTab,
        });

        if (userId) {
            params.append("userId", userId);
        }

        const res = await fetch(`/api/search?${params.toString()}`);

        const data = await res.json();

        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return {
    search,
    setSearch,
    results,
    loading,
  };
}