"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

export function useRequireAdmin() {
  const router = useRouter();
  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.role !== 'admin') {
      // Clear invalid token and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      router.replace('/auth/login');
    }
  }, [router]);
}
