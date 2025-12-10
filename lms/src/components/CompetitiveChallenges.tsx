"use client";
import { useState } from "react";
import { getUserFromToken, isLoggedIn, getDisplayName } from "@/lib/auth";

type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  deadline?: Date;
  participants: number;
  completed: boolean;
  userRank?: number;
  userScore?: number;
  leaderboard: Array<{
    rank: number;
    name: string;
    score: number;
    time: string;
  }>;
};

type ChallengeCategory = {
  category: string;
  challenges: Challenge[];
};

export default function CompetitiveChallenges({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<"available" | "completed" | "leaderboard">("available");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const isAuthenticated = isLoggedIn();
  const user = getUserFromToken();
  const displayName = getDisplayName();

  // Mock challenge data for demonstration
  const mockChallenges: ChallengeCategory[] = [
    {
      category: "Coding Challenges",
      challenges: [
        {
          id: "challenge-1",
          title: "React Component Optimization",
          description: "Optimize a slow React component to achieve 60+ FPS rendering performance.",
          difficulty: "medium",
          points: 150,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          participants: 42,
          completed: false,
          leaderboard: [
            { rank: 1, name: "Alex J.", score: 95, time: "2h 15m" },
            { rank: 2, name: "Sarah M.", score: 92, time: "2h 30m" },
            { rank: 3, name: "Mike T.", score: 88, time: "2h 45m" },
          ]
        },
        {
          id: "challenge-2",
          title: "State Management Refactor",
          description: "Refactor a class-based Redux application to use React hooks and Context API.",
          difficulty: "hard",
          points: 250,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          participants: 28,
          completed: false,
          leaderboard: [
            { rank: 1, name: "Emma R.", score: 98, time: "3h 20m" },
            { rank: 2, name: "John D.", score: 90, time: "4h 10m" },
          ]
        }
      ]
    },
    {
      category: "Debugging Challenges",
      challenges: [
        {
          id: "challenge-3",
          title: "Memory Leak Detection",
          description: "Identify and fix memory leaks in a React application with complex state management.",
          difficulty: "hard",
          points: 200,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          participants: 35,
          completed: false,
          leaderboard: [
            { rank: 1, name: "David K.", score: 97, time: "1h 45m" },
          ]
        }
      ]
    }
  ];

  const completedChallenges: Challenge[] = [
    {
      id: "challenge-completed-1",
      title: "Basic React Components",
      description: "Create functional components with props and state management.",
      difficulty: "easy",
      points: 50,
      participants: 120,
      completed: true,
      userRank: 12,
      userScore: 85,
      leaderboard: [
        { rank: 1, name: "Sarah W.", score: 100, time: "1h 10m" },
        { rank: 2, name: "Mike L.", score: 98, time: "1h 15m" },
        { rank: 3, name: "Emma T.", score: 95, time: "1h 20m" },
        { rank: 12, name: displayName, score: 85, time: "1h 45m" },
      ]
    }
  ];

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setActiveTab("available");
  };

  const completeChallenge = () => {
    if (!selectedChallenge) return;

    // Simulate challenge completion
    const updatedChallenge: Challenge = {
      ...selectedChallenge,
      completed: true,
      userRank: Math.floor(Math.random() * 10) + 1,
      userScore: Math.floor(Math.random() * 20) + 80,
      leaderboard: [
        ...selectedChallenge.leaderboard,
        {
          rank: selectedChallenge.leaderboard.length + 1,
          name: displayName,
          score: Math.floor(Math.random() * 20) + 80,
          time: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`
        }
      ]
    };

    // In a real app, this would send the completion to the server
    // completeChallengeOnServer(courseId, selectedChallenge.id, updatedChallenge.userScore);

    setSelectedChallenge(updatedChallenge);
  };

  const backToChallenges = () => {
    setSelectedChallenge(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDeadline = (deadline?: Date) => {
    if (!deadline) return "No deadline";
    const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return `${daysLeft} days left`;
  };

  if (!selectedChallenge) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border mt-8">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "available"
                ? "bg-orange-500 text-white"
                : "text-slate-600 hover:bg-orange-50"
            }`}
          >
            Available Challenges
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "completed"
                ? "bg-orange-500 text-white"
                : "text-slate-600 hover:bg-orange-50"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "leaderboard"
                ? "bg-orange-500 text-white"
                : "text-slate-600 hover:bg-orange-50"
            }`}
          >
            Leaderboard
          </button>
        </div>

        {activeTab === "available" && (
          <div className="space-y-6">
            {mockChallenges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No available challenges at the moment</p>
                <p className="text-xs mt-2">Check back later for new challenges!</p>
              </div>
            ) : (
              mockChallenges.map(category => (
                <div key={category.category}>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2">{category.category}</h3>
                  <div className="space-y-4">
                    {category.challenges.map(challenge => (
                      <div key={challenge.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{challenge.title}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span className="font-medium">🏆 {challenge.points} points</span>
                              <span>•</span>
                              <span>👥 {challenge.participants} participants</span>
                              <span>•</span>
                              <span>⏰ {formatDeadline(challenge.deadline)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => startChallenge(challenge)}
                            disabled={!isAuthenticated}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Accept Challenge
                          </button>
                          <button className="px-4 py-2 border border-orange-200 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-50 transition">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No completed challenges yet</p>
                <p className="text-xs mt-2">Complete a challenge to see your achievements here</p>
              </div>
            ) : (
              completedChallenges.map(challenge => (
                <div key={challenge.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full">
                          Completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="font-medium">🏆 {challenge.points} points earned</span>
                        <span>•</span>
                        <span>🥇 Rank: {challenge.userRank}</span>
                        <span>•</span>
                        <span>🎯 Score: {challenge.userScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-400 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-teal-500 transition">
                      View Certificate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white p-4 rounded-xl">
              <h3 className="font-bold text-lg">Overall Course Leaderboard</h3>
              <p className="text-sm opacity-90">Top performers across all challenges</p>
            </div>

            <div className="space-y-4">
              {/* Mock overall leaderboard */}
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {rank}
                    </div>
                    <div>
                      <div className="font-semibold">Student {rank}</div>
                      <div className="text-xs text-gray-500">Completed 5 challenges • 1250 points</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-500">#{rank}</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-medium rounded-full">
                      🏆 {1500 - (rank * 100)} points
                    </span>
                  </div>
                </div>
              ))}

              {isAuthenticated && (
                <div className="mt-4 p-3 border-2 border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {Math.floor(Math.random() * 20) + 6}
                      </div>
                      <div>
                        <div className="font-semibold">{displayName}</div>
                        <div className="text-xs text-gray-500">Your position • {Math.floor(Math.random() * 500) + 300} points</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">#{Math.floor(Math.random() * 20) + 6}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full">
                        🏆 {Math.floor(Math.random() * 500) + 300} points
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Challenge Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Complete challenges to earn points and climb the leaderboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Higher difficulty challenges award more points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Top 3 participants get featured on the course homepage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Earn certificates for completing challenge sets</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-600">
              🔒 Please <a href="/auth/login" className="font-medium underline">login</a> to participate in challenges and earn points.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (selectedChallenge && !selectedChallenge.completed) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border mt-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={backToChallenges}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Challenges
          </button>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(selectedChallenge.difficulty)}`}>
              {selectedChallenge.difficulty.charAt(0).toUpperCase() + selectedChallenge.difficulty.slice(1)}
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-medium rounded-full">
              🏆 {selectedChallenge.points} points
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">{selectedChallenge.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{selectedChallenge.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Challenge Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulty:</span>
                <span className="font-medium capitalize">{selectedChallenge.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Points:</span>
                <span className="font-medium">{selectedChallenge.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Participants:</span>
                <span className="font-medium">{selectedChallenge.participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="font-medium">{formatDeadline(selectedChallenge.deadline)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Leaderboard</h4>
            <div className="space-y-2 text-sm">
              {selectedChallenge.leaderboard.length === 0 ? (
                <p className="text-gray-500 text-center">No submissions yet</p>
              ) : (
                selectedChallenge.leaderboard.slice(0, 3).map((entry) => (
                  <div key={entry.rank} className="flex justify-between items-center p-2 bg-white rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{entry.rank}.</span>
                      <span>{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.score}%</span>
                      <span className="text-xs text-gray-500">{entry.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Challenge Instructions</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Fork the provided starter repository on GitHub</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Implement the required functionality following the specifications</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Write clean, well-documented code</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Submit your solution before the deadline</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Solutions will be automatically tested and scored</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={completeChallenge}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-500 transition shadow-lg"
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  return null;
}