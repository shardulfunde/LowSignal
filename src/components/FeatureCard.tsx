import { LucideIcon, WifiOff, Wifi, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  to: string;
  isOffline?: boolean;
  variant?: "default" | "highlight";
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  to,
  isOffline = false,
  variant = "default",
}: FeatureCardProps) => {
  const { t } = useLanguage();
  return (
    <Link
      to={to}
      className={`block p-5 rounded-2xl border-2 transition-all active:scale-[0.98] touch-target ${variant === "highlight"
          ? "bg-primary text-primary-foreground border-primary shadow-md"
          : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl flex-shrink-0 ${variant === "highlight" ? "bg-primary-foreground/20" : "bg-primary/10"
            }`}
        >
          <Icon
            className={`w-6 h-6 ${variant === "highlight" ? "text-primary-foreground" : "text-primary"}`}
          />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3
            className={`font-bold text-base leading-tight ${variant === "highlight" ? "text-primary-foreground" : "text-foreground"
              }`}
          >
            {title}
          </h3>
          {description && (
            <p
              className={`text-sm mt-1 leading-snug ${variant === "highlight" ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ${isOffline
              ? variant === "highlight"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-success/15 text-success border border-success/25"
              : variant === "highlight"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-secondary/15 text-secondary border border-secondary/25"
            }`}
        >
          {isOffline ? (
            <>
              <Check className="w-3 h-3" />
              <span>{t('components.featureCard.offline')}</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3" />
              <span>{t('components.featureCard.online')}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
