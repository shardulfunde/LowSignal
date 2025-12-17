import { Download, Star, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface LearningPathCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  isDownloaded: boolean;
  streak?: number;
  badges?: number;
}

const getEncouragement = (progress: number, t: any) => {
  if (progress === 0) return t('components.learningPathCard.encouragement.start');
  if (progress < 30) return t('components.learningPathCard.encouragement.great');
  if (progress < 60) return t('components.learningPathCard.encouragement.amazing');
  if (progress < 90) return t('components.learningPathCard.encouragement.almost');
  return t('components.learningPathCard.encouragement.finish');
};

const LearningPathCard = ({
  id,
  title,
  description,
  progress,
  lessonsCompleted,
  totalLessons,
  isDownloaded,
  streak = 0,
  badges = 0,
}: LearningPathCardProps) => {
  const { t } = useLanguage();
  return (
    <Link
      to={`/learning-paths/${id}`}
      className="block p-5 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-all active:scale-[0.98] touch-target"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">{description}</p>
        </div>
        {isDownloaded && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-success/15 text-success border border-success/25 text-xs font-bold flex-shrink-0">
            <Download className="w-3 h-3" />
            <span>{t('components.learningPathCard.saved')}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {lessonsCompleted} {t('components.learningPathCard.of')} {totalLessons} {t('components.learningPathCard.lessons')}
          </span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5 rounded-full" />
        <p className="text-xs text-muted-foreground mt-2 italic">{getEncouragement(progress, t)}</p>
      </div>

      {(streak > 0 || badges > 0) && (
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border">
          {streak > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{streak} {t('components.learningPathCard.days')}</p>
                <p className="text-xs text-muted-foreground">{t('components.learningPathCard.streak')}</p>
              </div>
            </div>
          )}
          {badges > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{badges}</p>
                <p className="text-xs text-muted-foreground">{t('components.learningPathCard.badges')}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default LearningPathCard;
