"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRequireInstructor } from "@/lib/use-require-instructor";

interface AdminUser { _id: string; email: string; firstName: string; lastName: string; role: string; createdAt: string; }

export default function AdminUsersPage() {
  useRequireInstructor();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const list = await apiFetch<AdminUser[]>(`/api/users`);
        setItems(list);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      {loading ? (
        <div className="rounded-lg border p-4">Loading users...</div>
      ) : error ? (
        <div className="rounded-lg border p-4 border-red-300 bg-red-50 text-red-800">{error}</div>
      ) : (
        <div className="grid gap-4">
          {items.map((u) => (
            <div key={u._id} className="rounded-lg border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.firstName} {u.lastName}</div>
                <div className="text-sm text-gray-500">{u.email} • {u.role}</div>
              </div>
              <div className="flex gap-2">
                <a href={`/dashboard/Admin/users/${u._id}`} className="px-3 py-1.5 rounded-md border text-sm">Details</a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <a href="/dashboard/profile" className="inline-flex px-4 py-2 rounded-md border font-medium hover:bg-gray-50 dark:hover:bg-white/10">My Profile</a>
      </div>
    </div>
  );
}
