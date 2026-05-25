"use client";

import Link from "next/link";
import { Plus, Clock, Play, MoreVertical } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    { label: "Total Mockups", value: "24", increase: "+3 this week" },
    { label: "Total Views", value: "1.2M", increase: "+14% vs last month" },
    { label: "Exports", value: "148", increase: "4 in last 24h" },
    { label: "Time Saved", value: "48h", increase: "Estimated" },
  ];

  const recentProjects = [
    { id: 1, name: "Finance App Onboarding", date: "2 hours ago", status: "Done", duration: "00:15", thumbnail: "bg-blue-900/40" },
    { id: 2, name: "Social Feed Scroll", date: "Yesterday", status: "Done", duration: "00:08", thumbnail: "bg-purple-900/40" },
    { id: 3, name: "Checkout Flow", date: "3 days ago", status: "Rendering", duration: "00:12", thumbnail: "bg-emerald-900/40" },
    { id: 4, name: "Profile Settings", date: "1 week ago", status: "Done", duration: "00:05", thumbnail: "bg-amber-900/40" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, John</h1>
        <p className="text-white/50">Here&apos;s what&apos;s happening with your mockups today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-[#34d399]">{stat.increase}</p>
          </div>
        ))}
      </div>

      {/* Quick Action & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Create Card */}
        <div className="col-span-1 bg-gradient-to-br from-[#1A1D2E] to-[#0D0F1A] border border-[#3B7BFF]/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#3B7BFF]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#3B7BFF]/20 flex items-center justify-center text-[#3B7BFF] mb-6">
              <Play fill="currentColor" size={20} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Create New Mockup</h3>
            <p className="text-sm text-white/60 mb-8 flex-1">
              Upload your raw screen recording and turn it into a cinematic presentation.
            </p>
            
            <Link 
              href="/dashboard/editor"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#06070A] py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-transform w-full"
            >
              <Plus size={18} />
              Start Creating
            </Link>
          </div>

          {/* Decorative Phone */}
          <div className="absolute -right-12 -bottom-12 w-48 h-64 bg-[#0B1020] border-4 border-white/10 rounded-[32px] transform rotate-12 opacity-50 shadow-2xl">
            <div className="absolute inset-2 bg-gradient-to-br from-[#3B7BFF]/20 to-purple-500/20 rounded-[24px]"></div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="col-span-1 lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
            <Link href="/dashboard/projects" className="text-sm text-[#3B7BFF] hover:underline">View all</Link>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                <div className={`w-16 h-12 rounded-lg ${project.thumbnail} flex items-center justify-center border border-white/10 relative overflow-hidden`}>
                  <Play size={14} className="text-white/60 group-hover:text-white transition-colors" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{project.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock size={12} />
                      {project.date}
                    </span>
                    <span className="text-xs text-white/30">•</span>
                    <span className="text-xs text-white/40">{project.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-md ${
                    project.status === "Done" ? "bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20" : 
                    "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                  }`}>
                    {project.status}
                  </span>
                  
                  <button className="text-white/30 hover:text-white transition-colors p-1">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
