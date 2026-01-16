import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const API_BASE = "https://low-signal-ai-1ay5.onrender.com";

const CreateLearningPathPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [subject, setSubject] = useState("");
  const [age, setAge] = useState(18);
  const [pathLanguage, setPathLanguage] = useState<"en" | "hi" | "mr">(language as "en" | "hi" | "mr");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const generatePath = async () => {
    if (!subject.trim()) {
      alert(t('learningPaths.enterSubject'));
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
            preferred_language: pathLanguage,
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

        alert(message || t('learningPaths.failedToGenerate'));
        return;
      }

      const data = await res.json();
      const pathId = crypto.randomUUID();

      if (currentUser?.uid) {
        try {
          await updateDoc(doc(db, "users", currentUser.uid), {
            learningPaths: arrayUnion({
              id: pathId,
              subject: subject.trim(),
              // Store as objects for future updates
              topics: data.topics.map((t: string) => ({ 
                name: t, 
                explanation: "", 
                questions: [] 
              })), 
              age: age,
              language: pathLanguage,
              timestamp: new Date(),
              focus_areas: focus ? focus.split(",").map((s) => s.trim()) : []
            })
          });
        } catch (saveError) {
          console.error("Failed to save learning path to history:", saveError);
          // We continue navigation even if saving fails
        }
      }

      navigate("/learning/topic", {
        state: {
          pathId, // Pass ID for updates
          subject,
          topics: data.topics, // Keep as strings for the UI component
          index: 0,
          age,
          language: pathLanguage,
        },
      });
    } catch (err) {
      console.error(err);
      alert(t('learningPaths.failedToGenerate'));
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

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar
        language={language}
        isOnline={isOnline}
        title={t('learningPaths.createTitle')}
        showBack
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <input
          className="w-full p-3 border rounded-xl"
          placeholder={t('learningPaths.subjectPlaceholder')}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div>
            <label className="text-sm font-semibold ml-1 mb-1 block">{t('learningPaths.ageLabel')}</label>
            <input
            type="number"
            className="w-full p-3 border rounded-xl"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            />
        </div>

        <div>
            <label className="text-sm font-semibold ml-1 mb-1 block">Language</label>
            <select
            className="w-full p-3 border rounded-xl bg-background"
            value={pathLanguage}
            onChange={(e) => setPathLanguage(e.target.value as "en" | "hi" | "mr")}
            >
            <option value="en">English (English)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="mr">Marathi (मराठी)</option>
            </select>
        </div>

        <input
          className="w-full p-3 border rounded-xl"
          placeholder={t('learningPaths.focusAreasPlaceholder')}
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        />

        <Button
          className="w-full h-14 text-lg font-bold"
          onClick={generatePath}
          disabled={loading || !isOnline}
        >
          {!isOnline ? t('learningPaths.offline') : loading ? t('learningPaths.generating') : t('learningPaths.generate')}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default CreateLearningPathPage;
