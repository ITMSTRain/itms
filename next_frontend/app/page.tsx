"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session) {
        router.push("/login"); // 🚫 Redirect if not logged in
      } else {
        setUser(session.session.user); // ✅ Allow access
      }

      setLoading(false);
    };

    checkUser();
  }, [supabase, router]);

  if (loading) return <p>Loading...</p>; // Prevents flicker

  return <h1>Welcome to Home, {user?.email}!</h1>;
}
