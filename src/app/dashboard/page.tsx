"use client";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-white">
      <Dashboard onLogout={() => router.push("/login")} />  
    </div>
  );
}