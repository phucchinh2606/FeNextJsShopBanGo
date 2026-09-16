"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, normalizeRole } from "@/src/store/useAuthStore";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Đảm bảo client đã load xong state từ LocalStorage/Cookie
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedUserRole = normalizeRole(user?.role);
      const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

      if (
        !normalizedUserRole ||
        !normalizedAllowedRoles.includes(normalizedUserRole)
      ) {
        router.push("/");
      }
    }
  }, [isHydrated, isAuthenticated, user, allowedRoles, router, pathname]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-800 border-t-transparent"></div>
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedUserRole = normalizeRole(user?.role);
    const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

    if (
      !normalizedUserRole ||
      !normalizedAllowedRoles.includes(normalizedUserRole)
    ) {
      return null;
    }
  }

  return <>{children}</>;
};
