"use client";

import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { Breadcrumbs } from "@/src/components/admin/Breadcrumbs";
import { AdminSidebar } from "@/src/components/admin/Sidebar";
import { AuthGuard } from "@/src/components/auth/AuthGuard";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AuthGuard allowedRoles={["Admin"]}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex">
        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isSidebarOpen ? "pl-64" : "pl-20"
          }`}
        >
          <AdminHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <main className="flex-1 p-6">
            <Breadcrumbs />
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
