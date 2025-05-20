"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        // If on protected route and not authenticated, redirect to login
        if (pathname.startsWith("/protected") && !session) {
          router.push("/login");
          return;
        }

        // If on root and authenticated, redirect to protected
        if (pathname === "/" && session) {
          router.push("/protected");
          return;
        }

        setIsAuthenticated(!!session);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If on protected route and not authenticated, don't render children
  if (pathname.startsWith("/protected") && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
