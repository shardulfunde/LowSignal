import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ChevronLeft, Brain, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const TestGenerator = () => {
  const { language, t } = useLanguage();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // user inputs
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);

  // test state
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [stage, setStage] = useState("form"); 
  // form | test | result

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const difficultyMap: Record<string, string> = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
  };

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

  // ---------------- API CALL ----------------

  const generateTest = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch(
        "https://low-signal-ai-1ay5.onrender.com/test/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            difficulty: difficultyMap[difficulty],
            num_questions: numQuestions,
            language,
          }),
        }
      );

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setQuestions(data.questions);
      setUserAnswers({});
      setStage("test");
    } catch (err) {
      setError("Failed to generate test");
    } finally {
      setLoading(false);
    }
  };

  const analyzeTest = async () => {
    setAnalyzing(true);
    try {
      const payload = {
        topic,
        language,
        results: questions.map((q, i) => ({
          question: q.question,
          selected_option_index: userAnswers[i] ?? -1,
          correct_option_index: q.correct_index,
          options: q.options
        }))
      };
      
      const res = await fetch("https://low-signal-ai-1ay5.onrender.com/test/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });
      
      if(!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  // ---------------- RESULT ----------------

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct_index) {
        score++;
      }
    });
    return score;
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar
        title={t('testGenerator.title')}
        language={language}
        showBack={stage !== "form"}
        isOnline={isOnline}
      />


      <main className="max-w-lg mx-auto px-4 py-6">

        {/* ---------- FORM ---------- */}
        {stage === "form" && (
          <>
            {/* Topic input */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                {t('testGenerator.enterTopic')}
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t('testGenerator.topicPlaceholder')}
                className="w-full h-12 px-4 rounded-xl border bg-card"
              />
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                {t('testGenerator.difficultyLevel')}
              </label>
              <div className="flex gap-3">
                {(["Easy", "Medium", "Hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl font-semibold ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    {t(`testGenerator.difficulties.${d.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of questions */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                {t('testGenerator.numberOfQuestions')}: {numQuestions}
              </label>
              <input
                type="range"
                min={5}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            <Button
              onClick={generateTest}
              disabled={loading || !topic.trim()}
              className="w-full h-14 text-lg font-bold"
            >
              <Play className="w-5 h-5 mr-2" />
              {loading ? t('testGenerator.generating') : t('testGenerator.generateTest')}
            </Button>
          </>
        )}

        {/* ---------- TEST ---------- */}
        {stage === "test" && (
          <>
            {questions.map((q, qi) => (
              <div
                key={qi}
                className="mb-6 p-4 rounded-xl bg-card border"
              >
                <p className="font-semibold mb-3">
                  {qi + 1}. {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() =>
                        setUserAnswers({ ...userAnswers, [qi]: oi })
                      }
                      className={`w-full p-3 rounded-lg text-left ${
                        userAnswers[qi] === oi
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              onClick={() => setStage("result")}
              className="w-full h-14 text-lg font-bold"
            >
              {t('testGenerator.submitTest')}
            </Button>
          </>
        )}

        {/* ---------- RESULT ---------- */}
        {stage === "result" && (
          <>
            <div className="p-6 rounded-xl bg-card border text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {t('testGenerator.result')}
              </h2>
              <p className="text-lg">
                {t('testGenerator.score')}:{" "}
                <span className="font-bold">
                  {calculateScore()} / {questions.length}
                </span>
              </p>
            </div>

            {!analysisResult && (
              <Button
                onClick={analyzeTest}
                disabled={analyzing}
                className="w-full h-14 text-lg font-bold mb-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
              >
                  {analyzing ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      Analyzing Performance...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze My Performance
                    </>
                  )}
              </Button>
            )}

            {analysisResult && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Score Commentary */}
                <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-5">
                  <h3 className="font-bold flex items-center gap-2 mb-2 text-primary">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysisResult.score_commentary}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 gap-4">
                  {analysisResult.strengths.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4" />
                        Strong Concepts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.strengths.map((str: string, i: number) => (
                          <span key={i} className="bg-background px-2.5 py-1 rounded-md text-sm font-medium border shadow-sm">
                            {str}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.weak_concepts.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                       <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                        <XCircle className="w-4 h-4" />
                        Areas to Improve
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.weak_concepts.map((wk: string, i: number) => (
                           <span key={i} className="bg-background px-2.5 py-1 rounded-md text-sm font-medium border shadow-sm">
                            {wk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Study Plan */}
                <div className="bg-card border rounded-xl p-5">
                   <h3 className="font-bold mb-4">Recommended Study Plan</h3>
                   <div className="space-y-4">
                      {analysisResult.study_plan.map((step: string, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-muted-foreground">{step}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {/* Review Answers */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold px-1">Review Answers</h3>
              <div className="space-y-4">
                {questions.map((q, qi) => {
                  const userChoice = userAnswers[qi];
                  const isCorrect = userChoice === q.correct_index;

                  return (
                    <div
                      key={qi}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <p className="font-medium mb-3">
                        <span className="opacity-70 mr-2">{qi + 1}.</span>
                        {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt: any, oi: number) => {
                          const isSelected = userChoice === oi;
                          const isTargetCorrect = q.correct_index === oi;

                          let optionClass = "bg-muted/30 text-muted-foreground border-transparent";
                          let icon = null;

                          if (isTargetCorrect) {
                            optionClass = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-medium";
                            icon = <CheckCircle className="w-4 h-4 ml-auto" />;
                          } else if (isSelected && !isTargetCorrect) {
                            optionClass = "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 font-medium";
                            icon = <XCircle className="w-4 h-4 ml-auto" />;
                          }

                          return (
                            <div
                              key={oi}
                              className={`flex items-center p-3 rounded-lg text-sm border ${optionClass}`}
                            >
                              <span className="w-6 font-mono opacity-70">
                                {String.fromCharCode(65 + oi)}.
                              </span>
                              <span className="flex-1">{opt}</span>
                              {icon}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => {
                setStage("form");
                setAnalysisResult(null);
                setQuestions([]);
              }}
              className="w-full mt-6"
              variant="outline"
            >
              {t('testGenerator.generateNewTest')}
            </Button>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default TestGenerator;
