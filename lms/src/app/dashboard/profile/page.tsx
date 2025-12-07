"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <form onSubmit={changePassword} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div>
      </div>
      <button
        disabled={saving}
        className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-xs font-semibold text-white hover:from-orange-600 hover:to-orange-500 disabled:opacity-60"
      >
        {saving ? 'Updating...' : 'Update password'}
      </button>
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
        // Update localStorage with new profile data for navbar synchronization
        if (typeof window !== 'undefined') {
          localStorage.setItem('userProfile', JSON.stringify({ firstName: data.firstName, lastName: data.lastName, email: data.email }));
        }
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
    <div className="min-h-screen bg-[#ffe9d6] bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                9T
              </span>
              Profile
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">My profile</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Manage your personal details, account security, and see a quick snapshot of your learning.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-700 hover:text-orange-500 transition"
            >
              ← Back to home
            </Link>
            <Link
              href="/dashboard/Student"
              className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-500 shadow-sm hover:bg-orange-50"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <main className="grid lg:grid-cols-3 gap-6 max-w-5xl">
          {/* Profile Card */}
          <div className="lg:col-span-2 rounded-3xl border border-orange-100 bg-white/95 p-6 md:p-7 shadow-lg backdrop-blur">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar + identity */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 overflow-hidden flex items-center justify-center text-white shadow-md">
                  {data.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.profilePicture} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-bold text-2xl">
                      {data.firstName?.[0] || data.email?.[0] || 'U'}
                    </span>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 cursor-pointer text-[10px] bg-white border border-orange-200 rounded-full px-2 py-0.5 shadow-sm text-orange-500 font-semibold">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && onSelectFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">
                  {data.firstName || data.lastName
                    ? `${data.firstName} ${data.lastName}`.trim()
                    : data.email}
                </div>
                <div className="text-xs text-slate-500">Role: {data.role}</div>
                <div className="text-xs text-slate-500">
                  Member since{" "}
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Personal information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">First name</label>
                  <input
                    value={data.firstName}
                    onChange={(e) => setData({ ...data, firstName: e.target.value })}
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">Last name</label>
                  <input
                    value={data.lastName}
                    onChange={(e) => setData({ ...data, lastName: e.target.value })}
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">Phone</label>
                  <input
                    value={data.phone || ''}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-slate-700">Bio</label>
                  <textarea
                    value={data.bio || ''}
                    onChange={(e) => setData({ ...data, bio: e.target.value })}
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Course Preferences */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Learning preferences</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">
                    Interests (comma separated)
                  </label>
                  <input
                    value={(data.preferences?.interests || []).join(', ')}
                    onChange={(e) =>
                      setData({
                        ...data,
                        preferences: {
                          ...(data.preferences || {}),
                          interests: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">
                    Preferred language
                  </label>
                  <select
                    value={data.preferences?.preferredLanguage || 'en'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        preferences: {
                          ...(data.preferences || {}),
                          preferredLanguage: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={data.preferences?.notifications ?? true}
                  onChange={(e) =>
                    setData({
                      ...data,
                      preferences: {
                        ...(data.preferences || {}),
                        notifications: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                />
                Receive course notifications and announcements
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white shadow-md hover:from-orange-600 hover:to-orange-500 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <Link
                href="/dashboard/Student"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-orange-200 bg-white text-sm font-semibold text-orange-500 hover:bg-orange-50"
              >
                Back to dashboard
              </Link>
            </div>
          </form>
        </div>

        {/* Security & Password + My Courses */}
        <div className="rounded-3xl border border-orange-100 bg-white/95 p-6 shadow-lg backdrop-blur space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Security</h2>
            <p className="text-[11px] text-slate-500 mb-4">
              Update your password regularly to keep your account safe.
            </p>
            <PasswordSection />
          </div>
          <div className="h-px bg-orange-100" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">My courses</h2>
            {enrollments.length === 0 ? (
              <p className="text-xs text-slate-500">No enrollments yet.</p>
            ) : (
              <div className="space-y-3">
                {enrollments.map((e, idx) => (
                  <div key={idx} className="rounded-2xl border border-orange-100 p-3 bg-orange-50/40">
                    <div className="font-semibold text-slate-900 text-sm">
                      {e.course?.title || 'Course'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Rs {e.course?.price} • {e.course?.category}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Progress: {e.progress}% • Status: {e.status}
                    </div>
                    <a
                      className="inline-flex mt-2 text-xs font-semibold text-orange-500 hover:text-orange-600"
                      href={`/courses/${e.course?._id || ''}`}
                    >
                      Go to course →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
