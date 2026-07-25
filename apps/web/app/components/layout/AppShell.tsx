"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAppStore } from "../../store/useAppStore";
import { SearchPalette } from "../search/SearchPalette";
import { AuthModal } from "../auth/AuthModal";

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

  // Desktop: sidebar is fixed, main content gets a left margin
  // Mobile: sidebar is an overlay drawer, main content uses full width
  const desktopSidebarW = sidebarCollapsed ? 60 : 260;

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar (handles both desktop fixed + mobile drawer internally) */}
      <Sidebar />

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{
          // On desktop, offset by sidebar width. On mobile, no offset (sidebar is overlay).
          marginLeft: 0,
        }}
      >
        {/* Inline style for desktop margin via CSS custom property */}
        <style>{`
          @media (min-width: 1024px) {
            .app-main-content {
              margin-left: ${desktopSidebarW}px;
            }
          }
        `}</style>
        <div className="app-main-content flex flex-col flex-1 min-w-0 transition-all duration-300">
          <TopBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Portals */}
      <SearchPalette />
      <AuthModal />
    </div>
  );
}
