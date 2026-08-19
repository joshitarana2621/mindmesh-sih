"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, ReactNode } from "react";
import { initAuthFromStorage } from "@/stores/auth-store";
export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: 1 } } }));
  useEffect(() => { initAuthFromStorage(); }, []);
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
