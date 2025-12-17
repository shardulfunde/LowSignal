import { useNavigate } from "react-router-dom";
import { Download, WifiOff, Heart } from "lucide-react";
import LanguageCard from "@/components/LanguageCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/utils/translations";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
];

const Onboarding = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-6 text-center">
        <div className="max-w-lg mx-auto px-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-lg">
          <span className="text-primary-foreground font-bold text-3xl">L</span>
        </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('common.lowSignal')}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{t('common.friendlyCompanion')}</p>
        </div>
      </div>

      {/* Language Selection */}
      <div className="flex-1 py-6">
        <div className="max-w-lg mx-auto px-6">
        <h2 className="text-xl font-bold text-foreground mb-1">{t('common.chooseLanguage')}</h2>
        <p className="text-muted-foreground mb-6">{t('common.pickLanguage')}</p>

        <div className="space-y-4">
          {languages.map((lang) => (
            <LanguageCard
              key={lang.code}
              code={lang.code}
              name={lang.name}
              nativeName={lang.nativeName}
              isSelected={language === lang.code}
              onSelect={(code) => setLanguage(code as Language)}
            />
          ))}
        </div>

        <button className="w-full mt-5 p-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 transition-colors flex items-center justify-center gap-2 touch-target">
          <Download className="w-5 h-5" />
          <span className="font-semibold">{t('common.downloadMore')}</span>
        </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-card border-t-2 border-border">
        <div className="max-w-lg mx-auto p-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-success/10 border-2 border-success/20 mb-5">
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="font-bold text-foreground">{t('common.learnAnytime')}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{t('common.worksOffline')}</p>
          </div>
        </div>

        <Button onClick={handleContinue} className="w-full h-14 text-lg font-bold rounded-xl shadow-md">
          {t('common.letsBegin')}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
          {t('common.madeWithLove')} <Heart className="w-3 h-3 text-destructive" /> {t('common.forRuralLearners')}
        </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
