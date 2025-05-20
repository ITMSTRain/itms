import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Road Guard - Home",
  description: "Road and Vehicle Web Surveillance System",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Road Guard</h1>
      <p className="text-xl text-gray-600">
        Road and Vehicle Web Surveillance System
      </p>
    </main>
  );
}
