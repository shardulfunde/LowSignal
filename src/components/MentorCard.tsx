import { MessageCircle, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface MentorCardProps {
  name: string;
  subject: string;
  availability: string;
  rating: number;
  studentsHelped: number;
  avatarInitial: string;
}

const MentorCard = ({
  name,
  subject,
  availability,
  rating,
  studentsHelped,
  avatarInitial,
}: MentorCardProps) => {
  const { t } = useLanguage();
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-bold text-lg">{avatarInitial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">{name}</h3>
          <p className="text-sm text-primary font-semibold">{subject}</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{availability}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-accent">★</span>
            <span className="font-semibold">{rating}</span>
          </div>
          <p className="text-xs text-muted-foreground">{studentsHelped} {t('components.mentorCard.helped')}</p>
        </div>
      </div>
      <Button className="w-full mt-3" variant="outline">
        <MessageCircle className="w-4 h-4 mr-2" />
        {t('components.mentorCard.message')}
      </Button>
    </div>
  );
};

export default MentorCard;
