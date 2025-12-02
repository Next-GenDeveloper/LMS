"use client";
import { useEffect, useState } from 'react';

const items = [
  { name: 'Ayesha', role: 'Developer', text: 'Best platform to upskill. The UI is clean and learning is fun!'},
  { name: 'Ali', role: 'Student', text: 'Courses are well structured and instructors are amazing.'},
  { name: 'Sara', role: 'Designer', text: 'Love the minimal design and the course quality.'},
];

export default function HomeTestimonials() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, []);
  const curr = items[index];
  return (
    <div className="relative w-full max-w-3xl mx-auto text-center">
      <div className="rounded-2xl border bg-white/70 dark:bg-white/5 backdrop-blur p-8 shadow-sm transition-all">
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">“{curr.text}”</p>
        <div className="mt-4 text-sm text-gray-500">{curr.name} • {curr.role}</div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, i) => (
          <span key={i} className={`h-1.5 w-6 rounded-full ${i === index ? 'bg-purple-600' : 'bg-gray-300 dark:bg-white/20'}`}></span>
        ))}
      </div>
    </div>
  );
}
