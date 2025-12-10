
"use client";
import { useState } from "react";

export default function FeatureTest() {
  const [activeFeature, setActiveFeature] = useState<"chat" | "quizzes" | "challenges">("chat");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border mt-8">
      <h2 className="text-xl font-bold mb-4">🚀 Enhanced Learning Features</h2>
      <p className="text-gray-600 mb-6">
        Test the new interactive features that elevate your learning experience.
      </p>

      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveFeature("chat")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            activeFeature === "chat"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setActiveFeature("quizzes")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            activeFeature === "quizzes"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📝 Quizzes
        </button>
        <button
          onClick={() => setActiveFeature("challenges")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            activeFeature === "challenges"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          🎯 Challenges
        </button>
      </div>

      {activeFeature === "chat" && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-bold mb-2">Live Chat Support</h3>
          <p className="text-sm text-gray-600">Chat with instructors and peers in real-time to resolve your doubts instantly.</p>
        </div>
      )}

      {activeFeature === "quizzes" && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-bold mb-2">Interactive Quizzes</h3>
          <p className="text-sm text-gray-600">Test your knowledge with instant feedback and personalized learning paths.</p>
        </div>
      )}

      {activeFeature === "challenges" && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-bold mb-2">Coding Challenges</h3>
          <p className="text-sm text-gray-600">Solve real-world problems and earn badges to showcase your skills.</p>
        </div>
      )}
    </div>
  );
}
