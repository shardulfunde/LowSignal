import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BookOpen,
  MessageCircle,
  FileText,
  Brain,
  ClipboardList,
  Trophy,
  Users,
  HelpCircle,
  Flame,
  Sparkles,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import FeatureCard from "@/components/FeatureCard";

const Home = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const features = [
    {
      icon: BookOpen,
      title: t('home.features.learningPaths'),
      description: t('home.features.learningPathsDesc'),
      to: "/learning-paths",
      isOffline: true,
      variant: "highlight" as const,
    },
    {
      icon: HelpCircle,
      title: t('home.features.askDoubts'),
      description: t('home.features.askDoubtsDesc'),
      to: "/doubt-solver",
      isOffline: false,
    },
    {
      icon: FileText,
      title: t('home.features.learnPdf'),
      description: t('home.features.learnPdfDesc'),
      to: "/pdf-learning",
      isOffline: false,
    },
    {
      icon: Brain,
      title: t('home.features.aiChat'),
      description: t('home.features.aiChatDesc'),
      to: "/study-chat",
      isOffline: false,
    },
    {
      icon: ClipboardList,
      title: t('home.features.testYourself'),
      description: t('home.features.testYourselfDesc'),
      to: "/test-generator",
      isOffline: true,
    },
    {
      icon: Trophy,
      title: t('home.features.villageRanks'),
      description: t('home.features.villageRanksDesc'),
      to: "/leaderboard",
      isOffline: true,
    },
    {
      icon: Users,
      title: t('home.features.findMentor'),
      description: t('home.features.findMentorDesc'),
      to: "/community",
      isOffline: false,
    },
    {
      icon: MessageCircle,
      title: t('home.features.communityHelp'),
      description: t('home.features.communityHelpDesc'),
      to: "/community",
      isOffline: false,
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning');
    if (hour < 17) return t('home.greeting.afternoon');
    return t('home.greeting.evening');
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{getGreeting()}! 👋</h1>
          <p className="text-muted-foreground mt-1 text-base">{t('home.readyToLearn')}</p>
        </div>

        {/* Streak Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-accent/25 to-accent/10 border-2 border-accent/30 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shadow-sm">
              <Flame className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-lg">7 {t('home.streak')} 🔥</p>
              <p className="text-sm text-muted-foreground mt-0.5">{t('home.doingGreat')}</p>
            </div>
          </div>
        </div>

        {/* Offline Notice when offline */}
        {!isOnline && (
          <div className="p-4 rounded-2xl bg-success/10 border-2 border-success/25 mb-6 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">{t('common.youAreOffline')}</span> — {t('common.offlineMessage')}
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              to={feature.to}
              isOffline={feature.isOffline}
              variant={feature.variant}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
