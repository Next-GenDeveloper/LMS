export default function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full bg-gray-200/60 dark:bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}
