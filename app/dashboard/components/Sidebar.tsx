"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Film, Settings, Plus } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Projects", href: "/dashboard/projects", icon: LayoutGrid },
    { label: "Templates", href: "/dashboard/templates", icon: Film },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-[220px] fixed top-0 left-0 h-screen border-r border-white/5 flex flex-col bg-[#08090D] z-50">
      {/* Logo */}
      <div className="h-[68px] flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3B7BFF, #8B5CF6)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="1" width="4" height="12" rx="1" fill="white" opacity="0.9" />
              <rect x="8" y="3" width="4" height="8" rx="1" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] text-[#F0F2F5]">MockFlow</span>
        </Link>
      </div>

      {/* Primary Action */}
      <div className="px-4 py-6">
        <Link
          href="/dashboard/editor"
          className="w-full flex items-center justify-center gap-2 bg-[#3B7BFF] hover:bg-[#3B7BFF]/90 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Mockup
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[#3B7BFF]" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Plan */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-white/40 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
