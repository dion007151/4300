"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Video, 
  FileText, 
  Briefcase, 
  Home, 
  Image as ImageIcon 
} from "lucide-react";

export function MobileNavDock() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "AI Chat", href: "/ai", icon: Sparkles },
    { label: "Video", href: "/video", icon: Video },
    { label: "Images", href: "/images", icon: ImageIcon },
    { label: "Resume", href: "/resume", icon: FileText },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-2 py-2 shadow-2xl shadow-cyan-950/40 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 font-medium scale-105"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400 animate-pulse" : ""}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
