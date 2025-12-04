"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useParams } from "next/navigation";
import { useRequireAdmin } from "@/lib/use-require-admin";

interface EnrollmentItem { status: string; progress: number; enrollmentDate: string; completionDate?: string; course?: { title: string; price: number; category?: string; thumbnail?: string } }

export default function AdminUserDetailPage() {
  useRequireAdmin();
  const params = useParams();
  const id = String(params?.id || "");
  const [items, setItems] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const list = await apiFetch<EnrollmentItem[]>(`/api/users/${id}/enrollments`);
        setItems(list);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">User Details</h1>

      {loading ? (
        <div className="rounded-lg border p-4">Loading enrollments...</div>
      ) : error ? (
        <div className="rounded-lg border p-4 border-red-300 bg-red-50 text-red-800">{error}</div>
      ) : (
        <div className="grid gap-4">
          {items.map((e, idx) => (
            <div key={idx} className="rounded-lg border p-4">
              <div className="font-medium">{e.course?.title || 'Course'}</div>
              <div className="text-sm text-gray-500">Rs {e.course?.price} • {e.course?.category}</div>
              <div className="text-sm">Status: {e.status} • Progress: {e.progress}%</div>
              <div className="text-xs text-gray-500">Enrolled: {new Date(e.enrollmentDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      <div>
        <a href="/dashboard/Admin/users" className="inline-flex px-4 py-2 rounded-md border font-medium hover:bg-gray-50 dark:hover:bg-white/10">Back to Users</a>
      </div>
    </div>
  );
}
