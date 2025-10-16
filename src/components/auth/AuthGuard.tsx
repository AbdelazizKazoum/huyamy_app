"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({
  children,
  requireAdmin = false,
}: AuthGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect when loading is complete and we know the auth state
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to signin
        const locale = pathname.split("/")[1] || "ar";
        router.replace(`/${locale}/signin`);
      } else if (requireAdmin && !isAdmin) {
        // Authenticated but not admin, redirect to home
        const locale = pathname.split("/")[1] || "ar";
        router.replace(`/${locale}`);
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router, pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-sm text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user || (requireAdmin && !isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-sm text-gray-600">جاري إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
