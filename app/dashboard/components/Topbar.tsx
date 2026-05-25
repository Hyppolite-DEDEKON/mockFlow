"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  // Simple breadcrumb logic based on pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumb = segments.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1)).join(" / ");

  return (
    <header className="h-[68px] flex items-center justify-between px-8 border-b border-white/5 bg-[#08090D]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-white/40">MockFlow</span>
        <span className="text-white/40">/</span>
        <span className="text-white">{breadcrumb === "Dashboard" ? "Overview" : breadcrumb.replace("Dashboard / ", "")}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-64 bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#3B7BFF]/50 focus:bg-white/10 transition-all placeholder:text-white/30"
          />
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#08090D]"></span>
        </button>
      </div>
    </header>
  );
}
