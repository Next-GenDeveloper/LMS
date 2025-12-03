"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import { getUserFromToken } from "@/lib/auth";
interface ProfileData { _id?: string; email: string; firstName: string; lastName: string; bio?: string; profilePicture?: string; phone?: string; role: string; preferences?: { interests?: string[]; preferredLanguage?: string; notifications?: boolean; }; }

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/api/users/me/password`, { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });
      alert('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e: any) {
      alert(e?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={changePassword} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
        </div>
      </div>
      <button disabled={saving} className="px-3 py-1.5 rounded-md bg-slate-900 text-white disabled:opacity-60">{saving ? 'Updating...' : 'Update Password'}</button>
    </form>
  );
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  async function load() {
    try {
      setLoading(true);
      try {
        const me = await apiFetch<ProfileData>(`/api/users/me`);
        setData(me);
        const tokenUser = getUserFromToken();
        const uid = tokenUser?.userId || me._id;
        if (uid) {
          const list = await apiFetch<any[]>(`/api/users/${uid}/enrollments`);
          setEnrollments(list);
        }
      } catch (apiErr) {
        // Fallback for preview: use token info + any draft from localStorage
        const tokenUser = getUserFromToken();
        const draft = typeof window !== 'undefined' ? localStorage.getItem('profileDraft') : null;
        const parsed = draft ? (JSON.parse(draft) as ProfileData) : null;
        const email = tokenUser?.email || parsed?.email || 'user@example.com';
        const firstName = parsed?.firstName || email.split('@')[0];
        const mock: ProfileData = {
          _id: 'mock-user',
          email,
          firstName,
          lastName: parsed?.lastName || '',
          bio: parsed?.bio || '',
          profilePicture: parsed?.profilePicture,
          phone: parsed?.phone || '',
          role: (tokenUser as any)?.role || 'student',
          preferences: parsed?.preferences || { interests: [], preferredLanguage: 'en', notifications: true },
        };
        setData(mock);
        setEnrollments([]);
      }
    } catch (e: any) {
      const msg = e?.message || 'Failed to load';
      setError(msg);
      if (String(msg).includes('API 401') || String(msg).includes('Unauthorized')) {
        router.replace('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  }

  const router = useRouter();
  useEffect(() => { load(); }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      try {
        await apiFetch(`/api/users/me`, { method: 'PUT', body: JSON.stringify(data) });
      } catch (apiErr) {
        // Save a local draft in preview
        if (typeof window !== 'undefined') {
          localStorage.setItem('profileDraft', JSON.stringify(data));
          localStorage.setItem('userProfile', JSON.stringify({ firstName: data.firstName, lastName: data.lastName, email: data.email }));
        }
      }
      await load();
      alert('Profile updated');
    } catch (e: any) {
      alert(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-10">Loading...</div>;
  if (error) {
    if (String(error).includes('API 401') || String(error).includes('Unauthorized')) {
      if (typeof window !== 'undefined') router.replace('/auth/login');
    }
    return <div className="container mx-auto px-4 py-10 text-red-600">{error}</div>;
  }
  if (!data) return null;

  function onSelectFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setData((d) => (d ? { ...d, profilePicture: String(reader.result) } : d));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your personal information and see your course activity.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Profile Card */}
        <div className="lg:col-span-2 rounded-xl border p-6 bg-white/70 dark:bg-white/5 backdrop-blur">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar + identity */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden flex items-center justify-center text-white">
                  {data.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.profilePicture} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-bold text-2xl">{data.firstName?.[0] || 'U'}</span>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 cursor-pointer text-xs bg-white dark:bg-black border rounded-full px-2 py-0.5 shadow">
                  Upload
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && onSelectFile(e.target.files[0])} className="hidden" />
                </label>
              </div>
              <div>
                <div className="text-sm text-gray-500">Role: {data.role}</div>
                <div className="text-sm text-gray-500">Member since {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First name</label>
                <input value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name</label>
                <input value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input value={data.phone || ''} onChange={(e) => setData({ ...data, phone: e.target.value })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea value={data.bio || ''} onChange={(e) => setData({ ...data, bio: e.target.value })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" rows={4} />
              </div>
            </div>

            {/* Course Preferences */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-semibold">Course Preferences</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Interests (comma separated)</label>
                  <input value={(data.preferences?.interests || []).join(', ')} onChange={(e) => setData({ ...data, preferences: { ...(data.preferences || {}), interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Language</label>
                  <select value={data.preferences?.preferredLanguage || 'en'} onChange={(e) => setData({ ...data, preferences: { ...(data.preferences || {}), preferredLanguage: e.target.value } })} className="w-full rounded-md border p-2 bg-white/80 dark:bg-white/10">
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={data.preferences?.notifications ?? true} onChange={(e) => setData({ ...data, preferences: { ...(data.preferences || {}), notifications: e.target.checked } })} />
                Receive course notifications
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
              <a href="/dashboard/Student" className="px-4 py-2 rounded-md border">Back</a>
            </div>
          </form>
        </div>

        {/* Security & Password */}
        <div className="rounded-xl border p-6 bg-white/70 dark:bg-white/5 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <PasswordSection />
          <div className="mt-6 h-px bg-gray-200" />
          <h2 className="text-xl font-semibold mt-6 mb-4">My Courses</h2>
          {enrollments.length === 0 ? (
            <p className="text-sm text-gray-500">No enrollments yet.</p>
          ) : (
            <div className="space-y-3">
              {enrollments.map((e, idx) => (
                <div key={idx} className="rounded-lg border p-3">
                  <div className="font-medium">{e.course?.title || 'Course'}</div>
                  <div className="text-sm text-gray-500">Rs {e.course?.price} • {e.course?.category}</div>
                  <div className="text-sm">Progress: {e.progress}% • Status: {e.status}</div>
                  <a className="inline-flex mt-2 text-sm text-purple-600 hover:text-purple-800" href={`/courses/${e.course?._id || ''}`}>Go to course →</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
