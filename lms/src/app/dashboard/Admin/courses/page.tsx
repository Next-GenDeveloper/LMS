"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRequireInstructor } from "@/lib/use-require-instructor";

interface CourseItem { id: string; title: string; description: string; price: number; thumbnail?: string; category?: string; isPublished?: boolean; }

export default function AdminCoursesPage() {
  useRequireInstructor();
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<Partial<CourseItem>>({ title: "", description: "", price: 0, thumbnail: "", category: "General" });
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch<CourseItem[]>(`/api/courses`);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await apiFetch(`/api/courses`, {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price) || 0,
          thumbnail: form.thumbnail,
          category: form.category,
        })
      });
      setForm({ title: "", description: "", price: 0, thumbnail: "", category: "General" });
      await load();
    } catch (e: any) {
      alert(e.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this course?')) return;
    await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Manage Courses</h1>

      <form onSubmit={createCourse} className="grid gap-3 md:grid-cols-2 rounded-lg border p-4">
        <div className="md:col-span-2 font-medium">Create New Course</div>
        <input placeholder="Title" value={form.title as any} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border p-2" required />
        <input placeholder="Category" value={form.category as any} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-md border p-2" />
        <input placeholder="Price (Rs)" type="number" value={form.price as any} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-md border p-2" />
        <input placeholder="Image URL" value={form.thumbnail as any} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="rounded-md border p-2 md:col-span-2" />
        <textarea placeholder="Description" value={form.description as any} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border p-2 md:col-span-2" rows={4} />
        <div className="md:col-span-2">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-60">{saving ? 'Saving...' : 'Create'}</button>
        </div>
      </form>

      {loading ? (
        <div className="rounded-lg border p-4">Loading courses...</div>
      ) : error ? (
        <div className="rounded-lg border p-4 border-red-300 bg-red-50 text-red-800">{error}</div>
      ) : (
        <div className="grid gap-4">
          {items.map((c) => (
            <div key={c.id} className="rounded-lg border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-gray-500">Rs {c.price} • {c.category}</div>
              </div>
              <div className="flex gap-2">
                <a href={`/courses/${c.id}/edit`} className="px-3 py-1.5 rounded-md border text-sm">Edit</a>
                <button onClick={() => remove(c.id)} className="px-3 py-1.5 rounded-md border text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
