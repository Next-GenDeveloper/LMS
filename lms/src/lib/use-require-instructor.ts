"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

export function useRequireInstructor() {
  const router = useRouter();
  useEffect(() => {
    const user = getUserFromToken();
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      router.replace('/auth/login');
    }
  }, [router]);
}
