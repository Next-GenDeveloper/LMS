
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
