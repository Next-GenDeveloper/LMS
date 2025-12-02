"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
  const [status, setStatus] = useState<'loading'|'ready'|'error'>('loading');
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState<{ users: number; courses: number; revenue: number } | null>(null);

  const router = useRouter();
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setStatus('loading');
        const data = await apiFetch<{ message: string; user: any }>(`/api/admin`);
        const statsData = await apiFetch<{ users: number; courses: number; revenue: number }>(`/api/admin/stats`);
        if (ignore) return;
        setUser(data.user);
        setMessage(data.message);
        setStats(statsData);
        setStatus('ready');
      } catch (e: any) {
        if (ignore) return;
        const msg = String(e?.message || 'Failed to load');
        setError(msg);
        setStatus('error');
        if (msg.includes('API 401') || msg.includes('Unauthorized')) {
          router.replace('/auth/login');
        }
      }
    }
    load();
    return () => { ignore = true };
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {status === 'loading' && (
        <div className="rounded-lg border p-4">Checking access...</div>
      )}

      {status === 'error' && (
        <div className="rounded-lg border p-4 border-red-300 bg-red-50 text-red-800">
          {error}
        </div>
      )}

      {status === 'ready' && (
        <>
          <div className="rounded-lg border p-4">{message}</div>
          <div className="rounded-lg border p-4">
            <p className="font-medium">You are signed in as:</p>
            <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">Total Users: {stats?.users ?? 0}</div>
        <div className="rounded-lg border p-4">Total Courses: {stats?.courses ?? 0}</div>
        <div className="rounded-lg border p-4">Revenue: Rs {stats?.revenue?.toLocaleString?.() ?? 0}</div>
      </div>

      <div className="rounded-lg border p-4">Recent activity will appear here.</div>

      <div>
        <a href="/dashboard/Admin/courses" className="inline-flex px-4 py-2 rounded-md border font-medium hover:bg-gray-50 dark:hover:bg-white/10">Manage Courses</a>
      </div>
    </div>
  );
}
