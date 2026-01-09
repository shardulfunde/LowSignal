import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { CheckCircle2, Circle, Loader2, Send, Sparkles } from "lucide-react";

const API_BASE = "https://low-signal-ai.onrender.com";

const LearningTopicPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { subject, topics, index, age, language } = state || {};

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Content State
  const [content, setContent] = useState<any>({
    explanation: "",
    practice_questions: [],
  });

  // Loading = The full screen loader with steps
  const [loading, setLoading] = useState(true);
  // Streaming = The cursor blinking effect while text is typing
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  // Ref to prevent stale closures inside the loop
  const contentRef = useRef<any>({ explanation: "", practice_questions: [] });

  const topicName = topics?.[index];
  const totalTopics = topics?.length || 0;
  const completedTopics = index;
  const progressPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Loading steps animation
  const loadingSteps = [
    { icon: Send, text: "Sending request to AI..." },
    { icon: Sparkles, text: "AI is generating content..." },
    { icon: Loader2, text: "Streaming your lesson..." },
  ];

  // Helper to update state and ref safely
  const updateContent = (updater: (prev: any) => any) => {
    setContent((prev: any) => {
      const newState = updater(prev);
      contentRef.current = newState;
      return newState;
    });
  };

  useEffect(() => {
    if (!topicName || !subject) return;

    let stepInterval: number | undefined;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTopic = async () => {
      // 1. Reset everything
      setLoading(true);
      setIsStreaming(true);
      updateContent(() => ({ explanation: "", practice_questions: [] }));
      setUserAnswers({});
      setShowResults(false);
      setLoadingStep(0);

      // 2. Start Loading Animation Cycle
      stepInterval = window.setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 1200);

      try {
        const res = await fetch(`${API_BASE}/learning_path/generate/topic_detail/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payload: {
              subject: subject,
              year_old: age || 18,
              preferred_language: language || "en",
              focus_areas: [],
            },
            topic_name: topicName,
          }),
          signal,
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        if (!res.body) throw new Error("No response body");

        // 3. Connection established! Stop the full screen loader, show the UI
        setLoading(false);

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffered = "";

        // 4. Read the stream
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffered += decoder.decode(value, { stream: true });
          
          // SSE events are separated by double newline
          const chunks = buffered.split("\n\n");
          buffered = chunks.pop() || ""; // Keep incomplete chunk

          for (const chunk of chunks) {
            const trimmed = chunk.trim();
            if (!trimmed.startsWith("data:")) continue;

            const jsonStr = trimmed.replace(/^data:\s*/, "");
            
            try {
              const payload = JSON.parse(jsonStr);

              switch (payload.type) {
                case "explanation_chunk":
                  // APPEND the new text chunk (Backend sends diffs)
                  updateContent((prev) => ({
                    ...prev,
                    explanation: (prev.explanation || "") + (payload.data || ""),
                  }));
                  break;

                case "question":
                  // APPEND the new question object
                  updateContent((prev) => ({
                    ...prev,
                    practice_questions: [...(prev.practice_questions || []), payload.data],
                  }));
                  break;

                case "error":
                  console.error("Stream error:", payload.message);
                  setIsStreaming(false);
                  break;

                case "done":
                  setIsStreaming(false);
                  break;
              }
            } catch (err) {
              console.warn("Failed to parse chunk", err);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          alert("Failed to load topic content");
        }
      } finally {
        setLoading(false);
        setIsStreaming(false);
        if (stepInterval) clearInterval(stepInterval);
      }
    };

    fetchTopic();

    return () => {
      controller.abort();
      if (stepInterval) clearInterval(stepInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicName, subject, language, age]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getLanguageLabel = () => {
    if (language === "hi") return "हिंदी";
    if (language === "mr") return "मराठी";
    return "EN";
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitAnswers = () => {
    const totalQuestions = content?.practice_questions?.length || 0;
    const answeredCount = Object.keys(userAnswers).length;

    if (answeredCount < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions before submitting.`);
      return;
    }

    setShowResults(true);
  };

  // --- SCORE CALCULATION ---
  const getScore = () => {
    if (!content?.practice_questions) return { correct: 0, total: 0 };

    let correct = 0;
    content.practice_questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.correct_index) {
        correct++;
      }
    });

    return {
      correct,
      total: content.practice_questions.length,
    };
  };

  if (!topics || index === undefined || !subject) {
    return <p className="p-4">Invalid learning path</p>;
  }

  const score = showResults ? getScore() : null;
  const LoadingIcon = loadingSteps[loadingStep].icon;

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} title={topicName} showBack />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              Progress: Topic {index + 1} of {totalTopics}
            </span>
            <span className="font-semibold text-primary">{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-2">
            {topics.map((topic: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1" title={topic}>
                {idx < index ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : idx === index ? (
                  <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Loading State - Only shows during initial connection */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-900" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-blue-500 animate-spin" />
              <LoadingIcon className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground animate-pulse">
                {loadingSteps[loadingStep].text}
              </p>
              <div className="flex gap-2 justify-center">
                {loadingSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === loadingStep ? "bg-blue-500 scale-125" : idx < loadingStep ? "bg-blue-300" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Explanation - With Typing Effect */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800">
              <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Explanation
              </h2>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                {content.explanation}
                {/* The blinking cursor only shows while streaming */}
                {isStreaming && <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse align-middle"></span>}
              </p>
            </div>

            {/* Practice Questions - Appears as they arrive */}
            {content.practice_questions && content.practice_questions.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="font-semibold text-lg">Practice Questions</h2>

                {content.practice_questions.map((q: any, questionIndex: number) => (
                    <div key={questionIndex} className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="font-medium mb-3">
                        {questionIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                        {q.options.map((opt: string, optionIndex: number) => {
                        const isSelected = userAnswers[questionIndex] === optionIndex;
                        const isCorrect = q.correct_index === optionIndex;
                        const showCorrect = showResults && isCorrect;
                        const showWrong = showResults && isSelected && !isCorrect;

                        return (
                            <button
                            key={optionIndex}
                            onClick={() => handleSelectAnswer(questionIndex, optionIndex)}
                            disabled={showResults}
                            className={`
                                w-full text-left p-3 rounded-lg border-2 transition-all
                                ${!showResults && isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200"}
                                ${showCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}
                                ${showWrong ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}
                                ${!showResults ? "hover:border-blue-300 cursor-pointer" : "cursor-default"}
                                disabled:opacity-100
                            `}
                            >
                            <div className="flex items-center gap-2">
                                <div
                                className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${isSelected && !showResults ? "border-blue-500 bg-blue-500" : "border-gray-300"}
                                    ${showCorrect ? "border-green-500 bg-green-500" : ""}
                                    ${showWrong ? "border-red-500 bg-red-500" : ""}
                                `}
                                >
                                {(isSelected || showCorrect) && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span className="flex-1">{opt}</span>
                                {showCorrect && <span className="text-green-600 font-semibold">✓</span>}
                                {showWrong && <span className="text-red-600 font-semibold">✗</span>}
                            </div>
                            </button>
                        );
                        })}
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* Submit Button */}
            {!showResults && content.practice_questions?.length > 0 && (
              <Button 
                className="w-full h-12 text-base font-semibold" 
                onClick={handleSubmitAnswers}
                disabled={isStreaming} // Don't let them submit until questions are done
              >
                {isStreaming ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Questions...
                    </>
                ) : "Submit Answers"}
              </Button>
            )}

            {/* Score Display */}
            {showResults && score && (
              <div
                className={`p-6 rounded-xl border-2 text-center animate-in zoom-in-95 ${
                  score.correct === score.total
                    ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
                    : "border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950"
                }`}
              >
                <p className="text-3xl font-bold mb-2">
                  {score.correct} / {score.total}
                </p>
                <p className="text-base text-muted-foreground">
                  {score.correct === score.total ? "Perfect! You got all answers correct! 🎉" : `You got ${score.correct} out of ${score.total} correct`}
                </p>
                {score.correct === score.total && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">Ready to move to the next topic!</p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {index > 0 && (
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate("/learning/topic", {
                      state: {
                        subject,
                        topics,
                        index: index - 1,
                        age,
                        language,
                      },
                    })
                  }
                >
                  ← Previous
                </Button>
              )}

              {index < topics.length - 1 && (
                <Button
                  className="flex-1"
                  onClick={() =>
                    navigate("/learning/topic", {
                      state: {
                        subject,
                        topics,
                        index: index + 1,
                        age,
                        language,
                      },
                    })
                  }
                >
                  Next Topic →
                </Button>
              )}

              {index === topics.length - 1 && (
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => navigate("/")}>
                  Complete Path 🎉
                </Button>
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default LearningTopicPage;