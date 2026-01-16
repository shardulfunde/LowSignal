import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Headphones,
  Volume2,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  BarChart
} from "lucide-react";

// Use the production URL for both general API and Feedback API
const API_BASE = "https://low-signal-ai-1ay5.onrender.com";
const FEEDBACK_API_BASE = "https://low-signal-ai-1ay5.onrender.com"; 

const LearningTopicPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { pathId, subject, topics, index, age, language } = state || {};

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Content State
  const [content, setContent] = useState<any>({
    explanation: "",
    practice_questions: [],
  });

  const [isStreaming, setIsStreaming] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  
  // Feedback State
  const [feedback, setFeedback] = useState<any>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  
  // Audio State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrent, setAudioCurrent] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const contentRef = useRef<any>({ explanation: "", practice_questions: [] });

  const topicName = topics?.[index];
  const totalTopics = topics?.length || 0;
  const completedTopics = index;
  const progressPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const updateContent = (updater: (prev: any) => any) => {
    setContent((prev: any) => {
      const newState = updater(prev);
      contentRef.current = newState;
      return newState;
    });
  };

  const saveTopicContent = async () => {
    if (!currentUser?.uid || !pathId || !topicName) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const paths = userData.learningPaths || [];
        
        const pathIndex = paths.findIndex((p: any) => p.id === pathId);
        
        if (pathIndex > -1) {
          const path = paths[pathIndex];
          let updatedTopics = [...path.topics];
          
          const topicIndex = updatedTopics.findIndex((t: any) => t.name === topicName);
          
          if (topicIndex > -1) {
             updatedTopics[topicIndex] = {
               ...updatedTopics[topicIndex],
               explanation: contentRef.current.explanation,
               questions: contentRef.current.practice_questions,
             };
          }

          paths[pathIndex] = { ...path, topics: updatedTopics };
          
          await updateDoc(userRef, { learningPaths: paths });
        }
      }
    } catch (err) {
      console.error("Error saving topic content:", err);
    }
  };

  // --- TOPIC STREAMING LOGIC ---
  useEffect(() => {
    if (!topicName || !subject) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTopic = async () => {
      setIsStreaming(true);
      updateContent(() => ({ explanation: "", practice_questions: [] }));
      setUserAnswers({});
      setShowResults(false);
      setFeedback(null); // Reset feedback
      setAudioUrl(null);
      setIsPlaying(false);
      setAudioCurrent(0);
      setAudioDuration(0);

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

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffered = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffered += decoder.decode(value, { stream: true });
          
          const chunks = buffered.split("\n\n");
          buffered = chunks.pop() || ""; 

          for (const chunk of chunks) {
            const trimmed = chunk.trim();
            if (!trimmed.startsWith("data:")) continue;

            const jsonStr = trimmed.replace(/^data:\s*/, "");
            
            try {
              const payload = JSON.parse(jsonStr);

              switch (payload.type) {
                case "explanation_chunk":
                  updateContent((prev) => ({
                    ...prev,
                    explanation: (prev.explanation || "") + (payload.data || ""),
                  }));
                  break;

                case "question":
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
                  saveTopicContent();
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
        }
      } finally {
        setIsStreaming(false);
      }
    };

    fetchTopic();

    return () => {
      controller.abort();
    };
  }, [topicName, subject, language, age]);

  // --- ONLINE/OFFLINE HANDLER ---
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

  // --- AUDIO LOGIC ---
  const getLanguageLabel = () => {
    const code = (language || "en").split("-")[0];
    const labels: Record<string, string> = { hi: "हिंदी", mr: "मराठी", en: "EN" };
    return labels[code] || "EN";
  };

  const getTTSLanguageCode = (lang: string | undefined) => {
    const codeMap: Record<string, string> = { "hi": "hi-IN", "mr": "mr-IN", "en": "en-IN" };
    if (!lang) return "en-IN";
    const shortCode = lang.split("-")[0];
    return codeMap[lang] || codeMap[shortCode] || "en-IN";
  };

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [audioUrl]);

  const generateAudio = async () => {
    const text = (contentRef.current?.explanation || content.explanation || "").trim();
    if (!text) { alert("No explanation available"); return; }
    setIsGeneratingAudio(true);
    const ttsLanguage = getTTSLanguageCode(language);

    try {
      const res = await fetch(`${API_BASE}/generate_tts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: ttsLanguage }),
      });
      if (!res.ok) throw new Error(`TTS API error ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Failed to generate audio.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Audio Controls...
  const handlePlayAudio = () => audioRef.current?.play().then(() => setIsPlaying(true));
  const handlePauseAudio = () => { audioRef.current?.pause(); setIsPlaying(false); };
  const handleStopAudio = () => { if(audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false); setAudioCurrent(0); } };
  const onTimeUpdate = () => { if(audioRef.current) setAudioCurrent(audioRef.current.currentTime); };
  const onLoadedMeta = () => { if(audioRef.current) setAudioDuration(audioRef.current.duration); };
  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const t = (Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)) * (audioDuration || 0);
    audioRef.current.currentTime = t;
    setAudioCurrent(t);
  };
  const formatTime = (s: number) => {
    if (!isFinite(s) || s <= 0) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  // --- QUIZ & FEEDBACK LOGIC ---

  const generateAIFeedback = async (
    allQs: any[],
    userAns: { [key: number]: number }
  ) => {
    setIsFeedbackLoading(true);

    // 1. Prepare Data for Pydantic Schema
    // Attach selected_index to every question
    const formattedQuestions = allQs.map((q, idx) => ({
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      selected_index: userAns[idx] !== undefined ? userAns[idx] : -1 // -1 or null
    }));

    const correctQs = formattedQuestions.filter(q => q.selected_index === q.correct_index);
    const incorrectQs = formattedQuestions.filter(q => q.selected_index !== q.correct_index);

    try {
      const response = await fetch(`${FEEDBACK_API_BASE}/generate_feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicName || "General Topic",
          questions: formattedQuestions,
          correct_questions: correctQs,
          incorrect_questions: incorrectQs
        })
      });

      if (!response.ok) throw new Error("Failed to fetch feedback");
      
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error("Feedback generation error:", error);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitAnswers = () => {
    const totalQuestions = content?.practice_questions?.length || 0;
    if (Object.keys(userAnswers).length < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions.`);
      return;
    }
    setShowResults(true);
    
    // Trigger AI Feedback Generation
    if (content.practice_questions) {
      generateAIFeedback(content.practice_questions, userAnswers);
    }
  };

  const getScore = () => {
    if (!content?.practice_questions) return { correct: 0, total: 0 };
    let correct = 0;
    content.practice_questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.correct_index) correct++;
    });
    return { correct, total: content.practice_questions.length };
  };

  if (!topics || index === undefined || !subject) {
    return <p className="p-4">Invalid learning path</p>;
  }

  const score = showResults ? getScore() : null;

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} title={topicName} showBack />

      <main className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Progress: Topic {index + 1} of {totalTopics}</span>
            <span className="font-semibold text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex items-center gap-2 flex-wrap pt-2">
            {topics.map((topic: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1">
                {idx < index ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : idx === index ? <Circle className="w-5 h-5 text-blue-500 fill-blue-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="p-4 md:p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 min-h-[150px]">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" /> Explanation
          </h2>
          <p className="text-base md:text-lg text-foreground leading-relaxed whitespace-pre-wrap">
            {content.explanation}
            {isStreaming && <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse align-middle"></span>}
          </p>
          
          <div className="mt-8 border-t border-blue-200 dark:border-blue-800 pt-6">
            {!audioUrl ? (
              <Button onClick={generateAudio} disabled={isGeneratingAudio || isStreaming || !content.explanation} className="h-12 w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 shadow-sm" variant="outline">
                {isGeneratingAudio ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating audio...</> : <><Headphones className="w-4 h-4 mr-2" /> Listen to Explanation</>}
              </Button>
            ) : (
              // Audio Player UI (Same as before)
              <div className="bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-sm flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Volume2 className="w-4 h-4 text-blue-500" /><span className="text-sm font-medium">Audio Explanation ({getLanguageLabel()})</span></div>
                    <div className="text-xs font-mono text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{formatTime(audioCurrent)} / {formatTime(audioDuration)}</div>
                 </div>
                 <div className="w-full h-4 relative cursor-pointer group flex items-center" onClick={onSeek}>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out" style={{ width: `${(audioDuration ? (audioCurrent / audioDuration) : 0) * 100}%` }} />
                    </div>
                    <div className="absolute h-3.5 w-3.5 bg-blue-600 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 pointer-events-none transform -translate-x-1/2" style={{ left: `${(audioDuration ? (audioCurrent / audioDuration) : 0) * 100}%` }} />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="icon" className="rounded-full w-10 h-10 bg-blue-600" onClick={isPlaying ? handlePauseAudio : handlePlayAudio}>{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}</Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500" onClick={handleStopAudio}><Square className="w-4 h-4 fill-current" /></Button>
                    </div>
                    <a href={audioUrl} download={`${topicName || "explanation"}.mp3`} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground"><Download className="w-5 h-5" /></a>
                 </div>
              </div>
            )}
            <audio ref={audioRef} src={audioUrl || ""} onEnded={() => setIsPlaying(false)} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMeta} className="hidden" />
          </div>
        </div>

        {/* Practice Questions */}
        {content.practice_questions && content.practice_questions.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-semibold text-lg">Practice Questions</h2>
            <div className="grid grid-cols-1 gap-4">
            {content.practice_questions.map((q: any, questionIndex: number) => (
                <div key={questionIndex} className="p-4 md:p-6 rounded-xl border bg-card shadow-sm">
                <p className="font-medium mb-4 text-lg">{questionIndex + 1}. {q.question}</p>
                <div className="space-y-3">
                    {q.options.map((opt: string, optionIndex: number) => {
                    const isSelected = userAnswers[questionIndex] === optionIndex;
                    const isCorrect = q.correct_index === optionIndex;
                    const showCorrect = showResults && isCorrect;
                    const showWrong = showResults && isSelected && !isCorrect;
                    return (
                        <button key={optionIndex} onClick={() => handleSelectAnswer(questionIndex, optionIndex)} disabled={showResults}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all 
                            ${!showResults && isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-800"} 
                            ${showCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : ""} 
                            ${showWrong ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}
                            ${!showResults ? "hover:border-blue-300 cursor-pointer" : "cursor-default"}`}
                        >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 min-w-[1.25rem] rounded-full border-2 flex items-center justify-center 
                            ${isSelected && !showResults ? "border-blue-500 bg-blue-500" : "border-gray-300"}
                            ${showCorrect ? "border-green-500 bg-green-500" : ""} ${showWrong ? "border-red-500 bg-red-500" : ""}`}>
                            {(isSelected || showCorrect) && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="flex-1 text-base">{opt}</span>
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
            </div>
        )}

        {/* Submit Button */}
        {!showResults && content.practice_questions?.length > 0 && (
          <div className="pt-4">
            <Button className="w-full h-12 text-base font-semibold" onClick={handleSubmitAnswers} disabled={isStreaming}>
              {isStreaming ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Questions...</> : "Submit Answers"}
            </Button>
          </div>
        )}

        {/* Score & FEEDBACK Display */}
        {showResults && score && (
          <div className="space-y-6">
            
            {/* 1. Score Card */}
            <div className={`p-6 rounded-xl border-2 text-center animate-in zoom-in-95 ${score.correct === score.total ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950" : "border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950"}`}>
              <p className="text-3xl font-bold mb-2">{score.correct} / {score.total}</p>
              <p className="text-base text-muted-foreground">{score.correct === score.total ? "Perfect! You got all answers correct! 🎉" : `You got ${score.correct} out of ${score.total} correct`}</p>
            </div>

            {/* 2. AI Feedback Section */}
            {isFeedbackLoading ? (
              <div className="p-8 rounded-xl border bg-card text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="font-medium">Analyze your performance with AI...</p>
                <p className="text-sm text-muted-foreground">Identifying strengths and weaknesses.</p>
              </div>
            ) : feedback ? (
              <div className="rounded-xl border bg-white dark:bg-card shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
                
                {/* Header */}
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" /> AI Performance Analysis
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                        Level: {feedback.understanding_level}
                    </span>
                </div>

                <div className="p-6 space-y-6">
                    {/* General Summary */}
                    <p className="text-foreground leading-relaxed italic border-l-4 border-purple-400 pl-4 py-1">
                        "{feedback.feedback}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2 text-green-600 dark:text-green-400">
                                <TrendingUp className="w-4 h-4" /> Strong Concepts
                            </h4>
                            {feedback.strengths.length > 0 ? (
                                <ul className="space-y-2">
                                    {feedback.strengths.map((str: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            {str}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">Keep practicing to build strengths!</p>}
                        </div>

                        {/* Weaknesses */}
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" /> Focus Areas
                            </h4>
                            {feedback.weaknesses.length > 0 ? (
                                <ul className="space-y-2">
                                    {feedback.weaknesses.map((wk: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <BarChart className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            {wk}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">No major weaknesses detected. Great job!</p>}
                        </div>
                    </div>

                    {/* Suggestions */}
                    {feedback.suggestions.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h4 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-3">
                                <Lightbulb className="w-4 h-4" /> Recommended Next Steps
                            </h4>
                            <ul className="grid grid-cols-1 gap-2">
                                {feedback.suggestions.map((sugg: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                        <span className="font-bold">•</span> {sugg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {index > 0 && (
            <Button variant="outline" className="h-12" onClick={() => navigate("/learning/topic", { state: { pathId, subject, topics, index: index - 1, age, language } })}>
              ← Previous
            </Button>
          )}

          {index < topics.length - 1 && (
            <Button className="flex-1 h-12" onClick={() => navigate("/learning/topic", { state: { pathId, subject, topics, index: index + 1, age, language } })}>
              Next Topic →
            </Button>
          )}

          {index === topics.length - 1 && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 h-12" onClick={() => navigate("/profile")}>
              Complete Path 🎉
            </Button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default LearningTopicPage;