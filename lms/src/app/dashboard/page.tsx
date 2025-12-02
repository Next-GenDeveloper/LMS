export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">User dashboard content</div>
        <div className="rounded-lg border p-4">Admin dashboard content</div>
      </div>
    </div>
  );
}
