import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardBackground from "./components/DashboardBackground";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06070A] text-[#F0F2F5] font-sans selection:bg-[#3B7BFF]/30">
      <DashboardBackground />
      <Sidebar />
      <div className="pl-[220px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
