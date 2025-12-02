"use client";
import MyLearningCard, { LearningItem } from "@/components/MyLearningCard";

const items: LearningItem[] = [
  {
    id: "c1",
    title: "React for Beginners",
    description: "Build interactive UIs with modern React and hooks.",
    imageUrl: "/next.svg",
    progress: 25,
    lastLesson: "Components & Props",
  },
  {
    id: "c2",
    title: "TypeScript Mastery",
    description: "Type-safe apps with TypeScript generics and best practices.",
    imageUrl: "/vercel.svg",
    progress: 60,
    lastLesson: "Utility Types",
  },
  {
    id: "c3",
    title: "Node.js APIs",
    description: "Build secure and scalable APIs using Express and Prisma.",
    imageUrl: "/globe.svg",
    progress: 10,
    lastLesson: "Express Basics",
  },
];

export default function MyLearningPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Learning</h1>
          <p className="text-gray-600 dark:text-gray-400">Continue where you left off.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">Sort</button>
          <button className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">Filter</button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id} style={{ animationDelay: `${i * 60}ms` }}>
            <MyLearningCard item={item} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
