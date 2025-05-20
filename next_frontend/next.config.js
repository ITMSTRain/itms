// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",
//   basePath: "/stride",
//   assetPrefix: "/stride/",
//   images: {
//     unoptimized: true,
//   },
//   env: {
//     NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
//     NEXT_PUBLIC_WS_BASE_URL: process.env.NEXT_PUBLIC_WS_BASE_URL,
//     NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
//   },
//   // Ensure trailing slashes are handled correctly
//   trailingSlash: true,
//   // Disable server-side features since we're doing static export
//   experimental: {
//     appDir: true,
//   },
// };

// module.exports = nextConfig;

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:9091", "https://localhost:8000"],
    },
  },
};

export default nextConfig;
