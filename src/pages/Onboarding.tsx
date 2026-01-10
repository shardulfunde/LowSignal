import { useNavigate } from "react-router-dom";
import { Download, WifiOff, Heart } from "lucide-react";
import LanguageCard from "@/components/LanguageCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/utils/translations";
import { useAuth } from "@/contexts/AuthContext";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
];

const Onboarding = () => {
  const { language, setLanguage, t } = useLanguage();
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/home");
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (currentUser) {
    navigate("/home");
    return null;
  }

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

        <div className="text-center mt-4">
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full h-14 text-lg font-medium flex items-center justify-center gap-2 rounded-xl border-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
          {t('common.madeWithLove')} <Heart className="w-3 h-3 text-destructive" /> {t('common.forRuralLearners')}
        </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
