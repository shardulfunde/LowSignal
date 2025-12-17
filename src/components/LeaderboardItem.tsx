import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaderboardItemProps {
  rank: number;
  villageName: string;
  points: number;
  studentsCount: number;
  trend: "up" | "down" | "same";
  isCurrentVillage?: boolean;
}

const LeaderboardItem = ({
  rank,
  villageName,
  points,
  studentsCount,
  trend,
  isCurrentVillage = false,
}: LeaderboardItemProps) => {
  const { t } = useLanguage();
  const getRankBadge = () => {
    if (rank === 1)
      return <Trophy className="w-5 h-5" style={{ color: "hsl(45 90% 50%)" }} />;
    if (rank === 2)
      return <Trophy className="w-5 h-5" style={{ color: "hsl(220 10% 65%)" }} />;
    if (rank === 3)
      return <Trophy className="w-5 h-5" style={{ color: "hsl(25 70% 50%)" }} />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all touch-target ${isCurrentVillage
          ? "bg-primary/5 border-primary"
          : "bg-card border-border"
        }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 flex items-center justify-center">{getRankBadge()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground truncate">{villageName}</h3>
            {isCurrentVillage && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-primary text-primary-foreground font-bold">
                {t('components.leaderboardItem.you')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{studentsCount} {t('components.leaderboardItem.learners')}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            {getTrendIcon()}
            <span className="font-bold text-lg text-foreground">{points.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t('components.leaderboardItem.points')}</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
