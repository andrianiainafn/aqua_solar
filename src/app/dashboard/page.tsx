"use client";

import { Dashboard } from "@/components/sections/Dashboard";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Home() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Dashboard onLogout={() => router.push("/login")} />
      </div>
    </ProtectedRoute>
  );
}
