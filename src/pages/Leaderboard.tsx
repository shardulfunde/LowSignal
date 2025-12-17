import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Sparkles } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import LeaderboardItem from "@/components/LeaderboardItem";

const leaderboardData = [
  { rank: 1, villageName: "Rampur", points: 12450, studentsCount: 45, trend: "up" as const },
  { rank: 2, villageName: "Chandapur", points: 11200, studentsCount: 38, trend: "same" as const },
  { rank: 3, villageName: "Shivganj", points: 10890, studentsCount: 52, trend: "up" as const },
  { rank: 4, villageName: "Karjat", points: 9750, studentsCount: 29, trend: "down" as const, isCurrentVillage: true },
  { rank: 5, villageName: "Bhosari", points: 8920, studentsCount: 41, trend: "up" as const },
  { rank: 6, villageName: "Pimpri", points: 8100, studentsCount: 35, trend: "down" as const },
  { rank: 7, villageName: "Wagholi", points: 7650, studentsCount: 27, trend: "same" as const },
  { rank: 8, villageName: "Hadapsar", points: 7200, studentsCount: 33, trend: "up" as const },
];

const Leaderboard = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  const currentVillage = leaderboardData.find((v) => v.isCurrentVillage);

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('leaderboard.title')} />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Your Village Highlight */}
        {currentVillage && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-muted-foreground mb-3">{t('leaderboard.yourVillage')}</h2>
            <LeaderboardItem
              rank={currentVillage.rank}
              villageName={currentVillage.villageName}
              points={currentVillage.points}
              studentsCount={currentVillage.studentsCount}
              trend={currentVillage.trend}
              isCurrentVillage={true}
            />
          </div>
        )}

        {/* Motivational Message */}
        <div className="p-4 rounded-2xl bg-accent/20 border-2 border-accent/30 mb-6 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="font-bold text-foreground">{t('leaderboard.pointsToNext')}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{t('leaderboard.keepLearning')}</p>
          </div>
        </div>

        {/* Time Period */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">{t('leaderboard.thisMonth')}</h2>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-sm font-semibold touch-target">
            <Calendar className="w-4 h-4" />
            December
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboardData.map((village) => (
            <LeaderboardItem
              key={village.rank}
              rank={village.rank}
              villageName={village.villageName}
              points={village.points}
              studentsCount={village.studentsCount}
              trend={village.trend}
              isCurrentVillage={village.isCurrentVillage}
            />
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6 italic">
          {t('leaderboard.updateNote')}
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
