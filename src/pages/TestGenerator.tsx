import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ChevronLeft } from "lucide-react";
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
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [stage, setStage] = useState("form"); 
  // form | test | result

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const difficultyMap = {
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

    try {
      const res = await fetch(
        "https://low-signal-ai.onrender.com/test/generate",
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
        title="Test Generator"
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
                Enter Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Fractions, Newton Laws, Grammar"
                className="w-full h-12 px-4 rounded-xl border bg-card"
              />
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Difficulty
              </label>
              <div className="flex gap-3">
                {["Easy", "Medium", "Hard"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl font-semibold ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of questions */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Number of Questions: {numQuestions}
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
              {loading ? "Generating..." : "Generate Test"}
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
              Submit Test
            </Button>
          </>
        )}

        {/* ---------- RESULT ---------- */}
        {stage === "result" && (
          <>
            <div className="p-6 rounded-xl bg-card border text-center">
              <h2 className="text-2xl font-bold mb-2">
                Result
              </h2>
              <p className="text-lg">
                Score:{" "}
                <span className="font-bold">
                  {calculateScore()} / {questions.length}
                </span>
              </p>
            </div>

            <Button
              onClick={() => setStage("form")}
              className="w-full mt-6"
              variant="outline"
            >
              Generate New Test
            </Button>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default TestGenerator;
