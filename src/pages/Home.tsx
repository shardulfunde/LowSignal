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
  Sparkles,
  Lock,
  ChevronRight,
  WifiOff,
  Zap,
  Star,
  Info, // Added Info icon for the About link
} from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Link } from "react-router-dom";

const Home = () => {
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

  const getLanguageLabel = () =>
    language === "hi" ? "हिंदी" : language === "mr" ? "मराठी" : "EN";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 17) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  };

  return (
    <div className="min-h-screen bg-slate-50/80 pb-24 md:pb-12">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header with Date/Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              {getGreeting()}, <span className="text-primary">Student</span> 👋
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Let's make some progress today.
            </p>
          </div>
          
          {/* PC Only: Streak Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-700">
             <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
             <span className="font-bold text-sm">7 Day Streak</span>
          </div>
        </div>

        {/* Offline Alert */}
        {!isOnline && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 items-center text-rose-700 animate-in fade-in slide-in-from-top-2">
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">{t("common.youAreOffline")}</p>
              <p className="text-xs opacity-90">{t("common.offlineMessage")}</p>
            </div>
          </div>
        )}

        {/* --- ACTIVE FEATURES GRID --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Start Learning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* 1. HERO CARD: Learning Paths */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <Link to="/learning-paths" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-emerald-100 flex flex-col justify-between min-h-[180px]">
                  <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-emerald-50/60 to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" /> Recommended
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="p-3.5 w-fit rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                        {t("home.features.learningPaths")}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium max-w-sm">
                        {t("home.features.learningPathsDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 2. ASK DOUBTS */}
            <Link to="/doubt-solver" className="group block col-span-1">
              <div className="h-full rounded-3xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-blue-100 flex flex-col justify-between min-h-[180px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3.5 w-fit rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {t("home.features.askDoubts")}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Get instant AI solutions
                  </p>
                </div>
              </div>
            </Link>

            {/* 3. AI CHAT */}
            <Link to="/study-chat" className="group block col-span-1">
              <div className="h-full rounded-3xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-violet-100 flex flex-col justify-between min-h-[180px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3.5 w-fit rounded-2xl bg-violet-50 text-violet-600 group-hover:bg-violet-500 group-hover:text-white transition-colors shadow-sm">
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                    {t("home.features.aiChat")}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Study companion
                  </p>
                </div>
              </div>
            </Link>

            {/* 4. TEST YOURSELF */}
            <Link to="/test-generator" className="group block col-span-1 md:col-span-2 lg:col-span-4">
              <div className="flex flex-col md:flex-row items-center gap-6 rounded-3xl bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-orange-100">
                <div className="p-3.5 rounded-2xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                    {t("home.features.testYourself")}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {t("home.features.testYourselfDesc")}
                  </p>
                </div>
                <div className="hidden md:block pr-4">
                   <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* --- LOCKED / COMING SOON SECTION --- */}
        <div className="pt-8 pb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">
            Coming Soon
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, title: t("home.features.learnPdf"), desc: "PDF Tools" },
              { icon: Trophy, title: t("home.features.villageRanks"), desc: "Leaderboard" },
              { icon: Users, title: t("home.features.findMentor"), desc: "Connect" },
              { icon: MessageCircle, title: t("home.features.communityHelp"), desc: "Community" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="relative flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-100/50 cursor-not-allowed select-none opacity-70 grayscale transition-opacity hover:opacity-100"
              >
                <div className="absolute top-3 right-3 text-slate-300">
                    <Lock className="w-4 h-4" />
                </div>
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                   <feature.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-sm block text-slate-500">
                    {feature.title}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                    Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FOOTER / ABOUT LINK (NEW) --- */}
        <div className="mt-8 mb-4 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in">
          {/* Subtle separator */}
          <div className="h-px w-32 bg-slate-200 mb-2" />
          
          <Link
            to="/about"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-slate-500 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all duration-300"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-semibold">About the Team</span>
          </Link>
          
          <p className="text-[10px] text-slate-400">
            © 2024 Education Initiative
          </p>
        </div>

      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;