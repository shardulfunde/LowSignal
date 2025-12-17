import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flame, Star, Sparkles } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import LearningPathCard from "@/components/LearningPathCard";
import { Button } from "@/components/ui/button";

const LearningPaths = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const learningPaths = [
    {
      id: "basic-math",
      title: t('learningPaths.courses.basicMath'),
      description: t('learningPaths.courses.basicMathDesc'),
      progress: 65,
      lessonsCompleted: 13,
      totalLessons: 20,
      isDownloaded: true,
      streak: 7,
      badges: 3,
    },
    {
      id: "everyday-science",
      title: t('learningPaths.courses.everydayScience'),
      description: t('learningPaths.courses.everydayScienceDesc'),
      progress: 30,
      lessonsCompleted: 6,
      totalLessons: 20,
      isDownloaded: true,
      streak: 0,
      badges: 1,
    },
    {
      id: "intro-coding",
      title: t('learningPaths.courses.introCoding'),
      description: t('learningPaths.courses.introCodingDesc'),
      progress: 10,
      lessonsCompleted: 2,
      totalLessons: 20,
      isDownloaded: false,
      streak: 0,
      badges: 0,
    },
    {
      id: "english-basics",
      title: t('learningPaths.courses.englishBasics'),
      description: t('learningPaths.courses.englishBasicsDesc'),
      progress: 0,
      lessonsCompleted: 0,
      totalLessons: 25,
      isDownloaded: false,
      streak: 0,
      badges: 0,
    },
  ];



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

  const totalBadges = learningPaths.reduce((acc, path) => acc + path.badges, 0);
  const currentStreak = Math.max(...learningPaths.map((p) => p.streak));

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('learningPaths.title')} />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border-2 border-border mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
              <p className="text-xs text-muted-foreground font-medium">{t('home.streak')}</p>
            </div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalBadges}</p>
              <p className="text-xs text-muted-foreground font-medium">{t('learningPaths.badges')}</p>
            </div>
          </div>
        </div>

        {/* Encouragement + CTA */}
        <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-6 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">{t('learningPaths.keepGoing')}</span> {t('learningPaths.progressMessage')}
          </p>
        </div>

        <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-md mb-6">
          {t('learningPaths.continueLearning')}
        </Button>

        {/* Learning Paths */}
        <h2 className="text-lg font-bold text-foreground mb-4">{t('learningPaths.yourCourses')}</h2>
        <div className="space-y-4">
          {learningPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              id={path.id}
              title={path.title}
              description={path.description}
              progress={path.progress}
              lessonsCompleted={path.lessonsCompleted}
              totalLessons={path.totalLessons}
              isDownloaded={path.isDownloaded}
              streak={path.streak}
              badges={path.badges}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default LearningPaths;
