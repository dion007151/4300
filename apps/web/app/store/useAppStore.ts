import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

export interface RecentFile {
  id: string;
  name: string;
  type: string;
  suite: string;
  progress: number;
  editedAt: string;
  icon: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  time: string;
  icon: string;
}

export interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
  activeSuite: string;
  searchQuery: string;
  searchOpen: boolean;
  authModalOpen: boolean;
  authTab: "signin" | "signup";
  recentFiles: RecentFile[];
  notifications: Notification[];
  user: { name: string; email: string; avatar: string } | null;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setActiveSuite: (suite: string) => void;
  setSearchQuery: (q: string) => void;
  setSearchOpen: (v: boolean) => void;
  setAuthModalOpen: (v: boolean, tab?: "signin" | "signup") => void;
  markNotificationsRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      sidebarCollapsed: false,
      activeSuite: "Dashboard",
      searchQuery: "",
      searchOpen: false,
      authModalOpen: false,
      authTab: "signin",
      user: null,

      recentFiles: [
        {
          id: "rf1",
          name: "Software Engineer Resume",
          type: "Resume",
          suite: "Resume Suite",
          progress: 86,
          editedAt: "12 min ago",
          icon: "bi-file-person"
        },
        {
          id: "rf2",
          name: "Client Proposal Draft",
          type: "Document",
          suite: "Document Suite",
          progress: 64,
          editedAt: "1 hr ago",
          icon: "bi-file-earmark-text"
        },
        {
          id: "rf3",
          name: "Q3 Portfolio Update",
          type: "Website",
          suite: "Portfolio Builder",
          progress: 42,
          editedAt: "Yesterday",
          icon: "bi-globe2"
        },
        {
          id: "rf4",
          name: "Marketing Campaign Images",
          type: "Image",
          suite: "Image Suite",
          progress: 100,
          editedAt: "2 days ago",
          icon: "bi-images"
        }
      ],

      notifications: [
        {
          id: "n1",
          message: "Resume score improved by 12 points",
          read: false,
          time: "2 min ago",
          icon: "bi-graph-up-arrow"
        },
        {
          id: "n2",
          message: "PDF compression finished (2.4 MB → 580 KB)",
          read: false,
          time: "18 min ago",
          icon: "bi-file-zip"
        },
        {
          id: "n3",
          message: "3 tasks are due today",
          read: false,
          time: "1 hr ago",
          icon: "bi-check2-square"
        },
        {
          id: "n4",
          message: "Portfolio published successfully",
          read: true,
          time: "Yesterday",
          icon: "bi-rocket-takeoff"
        }
      ],

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          localStorage.setItem("4300-theme", theme);
        }
      },

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },

      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setActiveSuite: (suite) => set({ activeSuite: suite }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      setAuthModalOpen: (v, tab) =>
        set({ authModalOpen: v, authTab: tab ?? get().authTab }),
      markNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true }))
        }))
    }),
    {
      name: "4300-store",
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed
      })
    }
  )
);
