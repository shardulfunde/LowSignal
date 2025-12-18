import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const API_BASE = "https://low-signal-ai.onrender.com";

const CreateLearningPathPage = () => {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [age, setAge] = useState(18);
  const [language, setLanguage] = useState<"en" | "hi" | "mr">("en");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const generatePath = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/learning_path/generate/topic_list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: subject.trim(),
            year_old: age,
            preferred_language: language,
            focus_areas: focus
              ? focus.split(",").map((s) => s.trim())
              : [],

          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error:", err);

        const message =
          typeof err.detail === "string"
            ? err.detail
            : JSON.stringify(err.detail);

        alert(message || "Failed to generate learning path");
        return;
      }

      const data = await res.json();

      navigate("/learning/topic", {
        state: {
          subject,
          topics: data.topics,
          index: 0,
          age,
          language,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate learning path");
    } finally {
      setLoading(false);
    }
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

  const getLanguageLabel = () => {
    if (language === "hi") return "हिंदी";
    if (language === "mr") return "मराठी";
    return "EN";
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar
        language={getLanguageLabel()}
        isOnline={isOnline}
        title="Create Learning Path"
        showBack
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Subject (e.g. Kinematics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-3 border rounded-xl"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />

        <select
          className="w-full p-3 border rounded-xl"
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "en" | "hi" | "mr")
          }
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Focus areas (comma separated)"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        />

        <Button
          className="w-full h-14 text-lg font-bold"
          onClick={generatePath}
          disabled={loading || !isOnline}
        >
          {!isOnline ? "Offline" : loading ? "Generating..." : "Generate"}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default CreateLearningPathPage;
