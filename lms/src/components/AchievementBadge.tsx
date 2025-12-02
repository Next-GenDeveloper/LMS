export default function AchievementBadge({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="rounded-xl border px-4 py-3 bg-white/80 dark:bg-white/5 backdrop-blur flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
