"use client";
import { useState, useEffect, useRef } from "react";
import { getUserFromToken, isLoggedIn, getDisplayName } from "@/lib/auth";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
};

export default function LiveChat({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = getUserFromToken();
  const isAuthenticated = isLoggedIn();
  const displayName = getDisplayName();

  // Mock data for demonstration
  const mockMessages: Message[] = [
    {
      id: "1",
      sender: "Instructor",
      content: "Welcome to the course! Feel free to ask any questions about the material.",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
    },
    {
      id: "2",
      sender: "Student A",
      content: "Thanks! I'm having trouble with the React hooks section. Can someone explain useEffect dependencies?",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false,
    },
    {
      id: "3",
      sender: "Instructor",
      content: "Great question! useEffect dependencies determine when the effect should re-run. I'll post a detailed explanation in the resources section.",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: false,
    },
  ];

  useEffect(() => {
    // Load mock messages
    setMessages(mockMessages);
    setOnlineUsers(Math.floor(Math.random() * 10) + 5); // Random online users count

    // Scroll to bottom
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: displayName,
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // In a real app, this would send the message to the server
    // sendMessageToServer(courseId, newMessage);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white px-4 py-3 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="font-medium">Live Chat</span>
        <span className="bg-white text-orange-500 text-xs font-bold px-2 py-1 rounded-full">
          {onlineUsers}
        </span>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-2xl border overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-sm">Course Discussion</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-orange-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p>No messages yet</p>
                <p className="text-xs mt-2">Be the first to ask a question!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.isCurrentUser
                        ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs">
                        {message.sender}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={!user}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !user}
                className="bg-gradient-to-r from-orange-500 to-amber-400 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            {!user && (
              <p className="text-xs text-gray-500 mt-2">
                Please <a href="/auth/login" className="text-orange-500 font-medium">login</a> to participate in chat
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}