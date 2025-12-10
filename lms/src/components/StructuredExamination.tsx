"use client";
import { useState, useEffect } from "react";
import { getUserFromToken, isLoggedIn } from "@/lib/auth";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
};

type QuizData = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  duration: number;
  retakeable: boolean;
};

export default function StructuredExamination({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<"available" | "completed">("available");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const isAuthenticated = isLoggedIn();
  const user = getUserFromToken();

  // Mock quiz data for demonstration
  const mockQuizzes: QuizData[] = [
    {
      id: "quiz-1",
      title: "React Fundamentals Assessment",
      description: "Test your understanding of React core concepts including components, state, and props.",
      questions: [
        {
          id: "q1",
          question: "What is the primary purpose of React?",
          options: [
            "To create complex animations",
            "To build user interfaces",
            "To manage databases",
            "To handle server-side routing"
          ],
          correctAnswer: 1,
          explanation: "React is a JavaScript library for building user interfaces, particularly single-page applications where UI updates are frequent."
        },
        {
          id: "q2",
          question: "Which hook would you use to manage state in a functional component?",
          options: [
            "useState",
            "useEffect",
            "useContext",
            "useReducer"
          ],
          correctAnswer: 0,
          explanation: "useState is the basic hook for adding state to functional components in React."
        },
        {
          id: "q3",
          question: "What does JSX stand for?",
          options: [
            "JavaScript XML",
            "JavaScript Extension",
            "JSON Syntax Extension",
            "JavaScript XHR"
          ],
          correctAnswer: 0,
          explanation: "JSX stands for JavaScript XML. It's a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
        }
      ],
      passingScore: 70,
      duration: 15,
      retakeable: true
    },
    {
      id: "quiz-2",
      title: "Advanced React Patterns",
      description: "Assess your knowledge of advanced React patterns including hooks, context, and performance optimization.",
      questions: [
        {
          id: "q1",
          question: "What is the purpose of the useEffect hook?",
          options: [
            "To manage component state",
            "To perform side effects in functional components",
            "To create context providers",
            "To handle routing"
          ],
          correctAnswer: 1,
          explanation: "useEffect hook is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM."
        },
        {
          id: "q2",
          question: "Which hook would you use to optimize performance by memoizing expensive calculations?",
          options: [
            "useMemo",
            "useCallback",
            "useRef",
            "useContext"
          ],
          correctAnswer: 0,
          explanation: "useMemo is used to memoize expensive calculations and prevent unnecessary recalculations on every render."
        }
      ],
      passingScore: 80,
      duration: 20,
      retakeable: false
    }
  ];

  const completedQuizzes: QuizData[] = [
    {
      id: "quiz-completed-1",
      title: "Introduction to Web Development",
      description: "Basic assessment completed on course enrollment.",
      questions: [],
      passingScore: 60,
      duration: 10,
      retakeable: true
    }
  ];

  const startQuiz = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(null);
    setTimeLeft(quiz.duration * 60);
    setTimerActive(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!selectedQuiz || quizCompleted) return;

    const updatedQuestions = selectedQuiz.questions.map((q, index) => {
      if (index === currentQuestionIndex) {
        return { ...q, userAnswer: answerIndex };
      }
      return q;
    });

    setSelectedQuiz({
      ...selectedQuiz,
      questions: updatedQuestions
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (selectedQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    if (!selectedQuiz) return;

    let correctAnswers = 0;
    selectedQuiz.questions.forEach(question => {
      if (question.userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / selectedQuiz.questions.length) * 100;
    setScore(calculatedScore);
    setQuizCompleted(true);
    setTimerActive(false);

    // In a real app, this would send the results to the server
    // submitQuizResults(courseId, selectedQuiz.id, calculatedScore);
  };

  const backToQuizList = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setTimerActive(false);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      submitQuiz();
    }

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedQuiz && !quizStarted) {
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
            Available Quizzes
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
        </div>

        {activeTab === "available" && (
          <div className="space-y-4">
            {mockQuizzes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No available quizzes for this course</p>
              </div>
            ) : (
              mockQuizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>{quiz.questions.length} questions</span>
                        <span>•</span>
                        <span>{quiz.duration} minutes</span>
                        <span>•</span>
                        <span>Passing: {quiz.passingScore}%</span>
                        <span>•</span>
                        <span>{quiz.retakeable ? "Retakeable" : "Single attempt"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => startQuiz(quiz)}
                      disabled={!isAuthenticated}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Quiz
                    </button>
                    <button className="px-4 py-2 border border-orange-200 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-50 transition">
                      Preview
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedQuizzes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No completed quizzes yet</p>
                <p className="text-xs mt-2">Complete a quiz to see your results here</p>
              </div>
            ) : (
              completedQuizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Completed</span>
                        <span>•</span>
                        <span>Score: 85%</span>
                        <span>•</span>
                        <span>Passed</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                      View Certificate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-600">
              🔒 Please <a href="/auth/login" className="font-medium underline">login</a> to take quizzes and earn certificates.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (selectedQuiz && quizStarted && !quizCompleted) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border mt-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={backToQuizList}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quizzes
          </button>

          <div className="text-sm text-gray-500">
            Time left: <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">{selectedQuiz.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{selectedQuiz.description}</p>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">{currentQuestion.question}</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  currentQuestion.userAnswer === index
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-200"
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-500 transition"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={currentQuestion.userAnswer === undefined}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-lg hover:from-orange-600 hover:to-orange-500 transition disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  if (selectedQuiz && quizCompleted) {
    const passed = score !== null && score >= selectedQuiz.passingScore;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border mt-8">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}>
            {passed ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {passed ? "Congratulations!" : "Quiz Completed"}
          </h2>

          <p className="text-gray-600 mb-4">
            {passed
              ? "You've successfully passed the quiz!"
              : "You didn't pass this time, but you can review the material and try again."}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-500 mb-1">Your Score</div>
            <div className="text-3xl font-bold text-orange-500">
              {score?.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedQuiz.passingScore}% required to pass
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {passed && (
            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-500 transition mb-3">
              🏆 Claim Certificate
            </button>
          )}

          <button
            onClick={backToQuizList}
            className="w-full py-2 border border-orange-200 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition"
          >
            Back to Quizzes
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Review Answers</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {selectedQuiz.questions.map((question, index) => {
              const isCorrect = question.userAnswer === question.correctAnswer;
              return (
                <div key={question.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">
                      Question {index + 1}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{question.question}</p>
                  <div className="space-y-1 text-xs">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          optIndex === question.correctAnswer
                            ? "bg-green-50 border border-green-200"
                            : question.userAnswer === optIndex
                            ? "bg-red-50 border border-red-200"
                            : ""
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                        {optIndex === question.correctAnswer && (
                          <span className="text-green-600 ml-1">✓ Correct</span>
                        )}
                        {question.userAnswer === optIndex && optIndex !== question.correctAnswer && (
                          <span className="text-red-600 ml-1">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}