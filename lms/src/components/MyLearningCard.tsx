"use client";
import ProgressBar from "./ProgressBar";

export type LearningItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  progress: number; // 0-100
  lastLesson?: string;
};

export default function MyLearningCard({ item }: { item: LearningItem }) {
  return (
    <div
      className="group rounded-xl border overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={{ animation: "fadeUp 400ms ease both" }}
    >
      <div className="relative h-36 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-snug">{item.title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.progress}%</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
        <div className="space-y-1">
          <ProgressBar value={item.progress} />
          {item.lastLesson && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Last lesson: {item.lastLesson}</p>
          )}
        </div>
        <div className="pt-2 flex gap-2">
          <button className="px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm transition-transform duration-200 hover:scale-[1.02]">
            Continue
          </button>
          <button className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
