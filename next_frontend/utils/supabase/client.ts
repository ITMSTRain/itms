import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  if (typeof window === "undefined") {
    throw new Error("Supabase client can only be used in the browser");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split("=")[1] : null;
        },
        set(
          name: string,
          value: string,
          options: { path?: string; maxAge?: number }
        ) {
          let cookie = `${name}=${value}`;
          if (options.path) cookie += `; path=${options.path}`;
          if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
          document.cookie = cookie;
        },
        remove(name: string, options: { path?: string }) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${options.path ? `; path=${options.path}` : ""}`;
        },
      },
    }
  );
};
