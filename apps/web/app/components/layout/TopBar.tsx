"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAppStore } from "../../store/useAppStore";
import { ReviewModal } from "../review/ReviewModal";
import Image from "next/image";
import clsx from "clsx";

export function TopBar() {
  const {
    theme,
    toggleTheme,
    setSearchOpen,
    notifications,
    markNotificationsRead,
    setAuthModalOpen,
    toggleMobileNav,
  } = useAppStore();

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const [showNotifs, setShowNotifs] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifsRef = useRef<HTMLDivElement>(null);

  // Close notifs when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cmd+K to open search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setSearchOpen]);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 px-3 sm:px-5"
      style={{
        height: "64px",
        background: "var(--bg-panel)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)"
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={toggleMobileNav}
        className="btn btn-ghost lg:hidden shrink-0"
        style={{ width: 38, padding: 0, justifyContent: "center" }}
        aria-label="Open menu"
      >
        <i className="bi bi-list text-xl" />
      </button>

      {/* Search bar */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex flex-1 max-w-md items-center gap-2 rounded-xl px-3 text-sm transition"
        style={{
          height: 38,
          background: "var(--bg-hover)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)"
        }}
      >
        <i className="bi bi-search text-sm" />
        <span className="flex-1 text-left truncate">Search tools, files, AI chats…</span>
        <kbd
          className="hidden sm:inline-flex items-center gap-1 rounded px-1.5 text-[10px] font-medium"
          style={{
            background: "var(--border)",
            color: "var(--text-muted)"
          }}
        >
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5 ml-auto">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{ width: 38, padding: 0, justifyContent: "center" }}
          title="Toggle theme"
        >
          <i className={clsx("bi text-base", theme === "dark" ? "bi-sun" : "bi-moon")} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => {
              setShowNotifs((v) => !v);
              if (!showNotifs) markNotificationsRead();
            }}
            className="btn btn-ghost relative"
            style={{ width: 38, padding: 0, justifyContent: "center" }}
            title="Notifications"
          >
            <i className="bi bi-bell text-base" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1.5 grid place-items-center text-white font-bold rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  fontSize: 9,
                  background: "#f43f5e"
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              className="absolute right-0 top-11 w-80 rounded-xl shadow-lg animate-fade-in"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                zIndex: 50
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Notifications
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  All caught up
                </span>
              </div>
              <div className="p-2 space-y-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                    style={{ background: "var(--bg-hover)" }}
                  >
                    <div
                      className="grid place-items-center shrink-0 rounded-lg"
                      style={{
                        width: 32,
                        height: 32,
                        background: "var(--accent-soft)",
                        color: "var(--accent)"
                      }}
                    >
                      <i className={`bi ${n.icon} text-sm`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs leading-5" style={{ color: "var(--text-primary)" }}>
                        {n.message}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sign in / User */}
        {user ? (
          <div className="relative" ref={notifsRef}>
            <button
              className="btn btn-ghost gap-2"
              onClick={() => setShowNotifs(v => !v)}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div
                  className="grid place-items-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{ width: 28, height: 28, background: "var(--accent)" }}
                >
                  {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm hidden sm:inline" style={{ color: "var(--text-primary)" }}>
                {user.name ?? user.email}
              </span>
            </button>
            {showNotifs && (
              <div
                className="absolute right-0 top-11 rounded-xl shadow-lg animate-fade-in"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  zIndex: 50,
                  minWidth: 160,
                  padding: "8px"
                }}
              >
                <button
                  className="sidebar-link w-full text-sm"
                  style={{ color: "#f43f5e" }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <i className="bi bi-box-arrow-right" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setAuthModalOpen(true, "signin")}
          >
            <i className="bi bi-person" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>

      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
    </header>
  );
}
