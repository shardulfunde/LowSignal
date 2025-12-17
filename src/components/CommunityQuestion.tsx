import { ThumbsUp, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CommunityQuestionProps {
  question: string;
  author: string;
  village: string;
  upvotes: number;
  replies: number;
  timeAgo: string;
  subject: string;
}

const CommunityQuestion = ({
  question,
  author,
  village,
  upvotes,
  replies,
  timeAgo,
  subject,
}: CommunityQuestionProps) => {
  const { t } = useLanguage();
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-secondary-foreground font-bold">
            {author.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground">{author}</span>
            <span className="text-muted-foreground text-sm">• {village}</span>
            <span className="text-muted-foreground text-sm">• {timeAgo}</span>
          </div>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {subject}
          </span>
        </div>
      </div>

      <p className="mt-3 text-foreground leading-relaxed">{question}</p>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{upvotes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">{replies} {t('components.communityQuestion.replies')}</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityQuestion;
