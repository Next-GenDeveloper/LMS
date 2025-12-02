"use client";
import { useState } from "react";

export default function Accordion({ items }: { items: { title: string; content: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="divide-y rounded-xl border overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur">
      {items.map((it, idx) => (
        <div key={idx}>
          <button
            className="w-full text-left px-4 py-3 font-medium hover:bg-gray-50 dark:hover:bg-white/10 flex items-center justify-between"
            onClick={() => setOpenIndex((i) => (i === idx ? null : idx))}
          >
            <span>{it.title}</span>
            <span className="text-xl leading-none">{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{it.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
