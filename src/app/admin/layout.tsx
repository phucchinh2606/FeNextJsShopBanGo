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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex relative">
        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Backdrop Mờ cho Mobile khi mở Sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          />
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 w-full ${
            isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
          }`}
        >
          <AdminHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <main className="flex-1 p-3 sm:p-6">
            <Breadcrumbs />
            <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
