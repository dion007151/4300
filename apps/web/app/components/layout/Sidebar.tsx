"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAppStore } from "../../store/useAppStore";
import clsx from "clsx";
import { useEffect } from "react";

const navItems = [
  { label: "Dashboard",         icon: "bi-house",              href: "/" },
  { label: "AI Tools",          icon: "bi-stars",              href: "/ai" },
  { label: "Resume Suite",      icon: "bi-file-person",        href: "/resume" },
  { label: "Document Suite",    icon: "bi-file-earmark-text",  href: "/documents" },
  { label: "Image Suite",       icon: "bi-images",             href: "/images" },
  { label: "Video Suite",       icon: "bi-camera-video",       href: "/video" },
  { label: "Productivity",      icon: "bi-grid-1x2",           href: "/productivity" },
  { label: "Portfolio Builder", icon: "bi-globe2",             href: "/portfolio" },
  { label: "Job Center",        icon: "bi-briefcase",          href: "/jobs" },
  { label: "Templates",         icon: "bi-collection",         href: "/templates" }
];

const secondaryItems = [
  { label: "Settings",   icon: "bi-gear",           href: "/settings" },
  { label: "Help",       icon: "bi-question-circle", href: "/help" }
];

export function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    setAuthModalOpen,
    mobileNavOpen,
    setMobileNavOpen,
  } = useAppStore();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user ?? null;

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setMobileNavOpen]);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={clsx(
        "flex flex-col h-full transition-all duration-300",
        !mobile && (sidebarCollapsed ? "w-[60px]" : "w-[260px]"),
        mobile && "w-[280px]"
      )}
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)"
      }}
    >
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-4 shrink-0",
          !mobile && sidebarCollapsed && "justify-center px-0"
        )}
        style={{ borderBottom: "1px solid var(--border)", minHeight: "64px" }}
      >
        <div className="shrink-0 rounded-xl overflow-hidden" style={{ width: 40, height: 40 }}>
          <Image
            src="/logo.png"
            alt="4300 Logo"
            width={40}
            height={40}
            style={{ objectFit: "contain", width: 40, height: 40 }}
            priority
          />
        </div>
        {(!sidebarCollapsed || mobile) && (
          <div className="min-w-0">
            <div className="font-display font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
              4300
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Everything. For Free.
            </div>
          </div>
        )}
        {/* Mobile close button */}
        {mobile && (
          <button
            onClick={() => setMobileNavOpen(false)}
            className="btn btn-ghost ml-auto"
            style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
          >
            <i className="bi bi-x-lg text-base" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {(!sidebarCollapsed || mobile) && (
          <div className="label px-2 pb-2 pt-1">WORKSPACE</div>
        )}
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "sidebar-link",
                isActive && "active",
                !mobile && sidebarCollapsed && "justify-center px-0"
              )}
              title={!mobile && sidebarCollapsed ? item.label : undefined}
            >
              <i className={clsx("bi", item.icon, "text-[16px] shrink-0")} />
              {(!sidebarCollapsed || mobile) && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          {(!sidebarCollapsed || mobile) && (
            <div className="label px-2 pb-2">ACCOUNT</div>
          )}
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "sidebar-link",
                !mobile && sidebarCollapsed && "justify-center px-0"
              )}
              title={!mobile && sidebarCollapsed ? item.label : undefined}
            >
              <i className={clsx("bi", item.icon, "text-[16px] shrink-0")} />
              {(!sidebarCollapsed || mobile) && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom — sign in + collapse */}
      <div className="shrink-0 p-2" style={{ borderTop: "1px solid var(--border)" }}>
        {user ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={clsx(
              "sidebar-link w-full",
              !mobile && sidebarCollapsed && "justify-center px-0"
            )}
            style={{ marginBottom: "4px" }}
          >
            <div
              className="grid place-items-center rounded-full shrink-0 text-white text-xs font-bold"
              style={{ width: 24, height: 24, background: "var(--accent)", flexShrink: 0 }}
            >
              {(user.name ?? user.email ?? "U")[0].toUpperCase()}
            </div>
            {(!sidebarCollapsed || mobile) && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {user.name ?? user.email}
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Sign out</p>
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true, "signin")}
            className={clsx(
              "sidebar-link w-full",
              !mobile && sidebarCollapsed && "justify-center px-0"
            )}
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              border: "1px solid rgba(79,111,255,0.15)",
              marginBottom: "4px"
            }}
          >
            <i className="bi bi-person-circle text-[16px]" />
            {(!sidebarCollapsed || mobile) && <span className="font-semibold">Sign In / Sign Up</span>}
          </button>
        )}

        {/* Collapse toggle — desktop only */}
        {!mobile && (
          <button
            onClick={toggleSidebar}
            className={clsx(
              "sidebar-link w-full mt-1",
              sidebarCollapsed && "justify-center px-0"
            )}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i
              className={clsx(
                "bi text-[16px]",
                sidebarCollapsed ? "bi-layout-sidebar" : "bi-layout-sidebar-reverse"
              )}
            />
            {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop sidebar (fixed) ── */}
      <div
        className="hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col"
        style={{
          width: sidebarCollapsed ? 60 : 260,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)"
        }}
      >
        <SidebarContent />
      </div>

      {/* ── Mobile overlay backdrop ── */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.60)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 lg:hidden flex flex-col transition-transform duration-300",
        )}
        style={{
          transform: mobileNavOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent mobile />
      </div>
    </>
  );
}
