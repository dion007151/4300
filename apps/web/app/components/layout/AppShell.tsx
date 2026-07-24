"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAppStore } from "../../store/useAppStore";
import { SearchPalette } from "../search/SearchPalette";
import { AuthModal } from "../auth/AuthModal";
import clsx from "clsx";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, sidebarCollapsed } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Sync theme class on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("4300-theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />
    );
  }

  const sidebarW = sidebarCollapsed ? 60 : 260;

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarW }}
      >
        <TopBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Portals */}
      <SearchPalette />
      <AuthModal />
    </div>
  );
}
