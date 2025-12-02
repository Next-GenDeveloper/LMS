"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type CourseForm = {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    price: 0,
    imageUrl: "/next.svg",
  });

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // If backend exists, fetch real data
        if (process.env.NEXT_PUBLIC_BACKEND_URL) {
          const data = await apiFetch<any>(`/api/courses/${courseId}`);
          if (!ignore) {
            setForm({
              title: data.title ?? "",
              description: data.description ?? "",
              price: Number(data.price ?? 0),
              imageUrl: data.thumbnail || data.imageUrl || "/next.svg",
            });
          }
        } else {
          // Fallback demo values
          const demo = {
            title: `Demo Course ${courseId}`,
            description: "Edit the course info and click save.",
            price: 1999,
            imageUrl: "/vercel.svg",
          };
          if (!ignore) setForm(demo);
        }
      } catch (e: any) {
        if (!ignore) setError(e.message || "Failed to load course");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (courseId) load();
    return () => {
      ignore = true;
    };
  }, [courseId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        await apiFetch(`/api/courses/${courseId}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: Number(form.price),
            thumbnail: form.imageUrl,
          }),
        });
      } else {
        // Simulate save
        await new Promise((r) => setTimeout(r, 600));
        console.log("Saved (demo):", { id: courseId, ...form });
      }
      router.push("/courses");
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 text-red-800 p-3">{error}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={5}
            className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (Rs)</label>
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10"
          />
          <p className="mt-2 text-xs text-gray-500">You can paste a URL or integrate Uploadthing/Cloudinary later.</p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
