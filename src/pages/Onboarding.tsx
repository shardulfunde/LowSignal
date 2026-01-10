import { useNavigate } from "react-router-dom";
import { EyeOff, Brain, Zap, ArrowRight, Sparkles, Layers, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "@/components/TopBar";
import { useState, useEffect } from "react";

const Onboarding = () => {
  const { t, language } = useLanguage();
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
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

  const handleStart = async () => {
    if (currentUser) {
      navigate("/home");
    } else {
      try {
        await signInWithGoogle();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getLanguageLabel = () =>
    language === "hi" ? "हिंदी" : language === "mr" ? "मराठी" : "EN";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 overflow-hidden relative isolate">
      {/* --- Modern Background Layer --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        {/* Technical Grid Pattern */}
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Glow Orbs */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 opacity-20 blur-[120px]"></div>
      </div>

      <div className="relative z-50 w-full">
        <TopBar language={getLanguageLabel()} isOnline={isOnline} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-16 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center space-y-16 animate-in fade-in zoom-in-95 duration-700">
          
          {/* --- Hero Section --- */}
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-4 animate-in slide-in-from-top-4 duration-1000 delay-150">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 Now Available
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-foreground leading-[0.9] text-balance drop-shadow-sm">
              Zero Noise. <br />
              <span className="bg-gradient-to-r from-blue-600 via-primary to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Pure Signal.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto leading-relaxed text-balance">
              The intelligent workspace that adapts to your learning curve. 
              Distraction-free, AI-driven, and designed for deep focus.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={handleStart}
                size="lg"
                className="relative h-14 px-8 rounded-full text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.4)] hover:scale-105 group overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                
                <span className="relative z-20 flex items-center gap-2">
                  {currentUser ? "Enter Workspace" : "Start Learning Free"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground/70">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900" />
                   ))}
                </div>
                <span>Join 10k+ learners</span>
              </div>
            </div>
          </div>

          {/* --- Bento Grid Features --- */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-8 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
            {/* Feature 1 */}
            <div className="group relative p-6 md:p-8 rounded-3xl bg-gradient-to-b from-muted/50 to-muted/10 border border-white/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-background shadow-sm border border-border/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <EyeOff className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Distraction Free</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A minimalist interface designed to help you enter a flow state. No notifications, no clutter, just pure learning.
                </p>
              </div>
            </div>

            {/* Feature 2 (Highlighted) */}
            <div className="group relative p-6 md:p-8 rounded-3xl bg-foreground text-background border border-foreground/10 transition-all duration-500 hover:-translate-y-1 shadow-xl">
               {/* Abstract decorative element */}
               <Sparkles className="absolute top-4 right-4 w-20 h-20 text-background/5 rotate-12" />
               
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500">
                  <Brain className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Adaptive AI</h3>
                <p className="text-background/70 text-sm leading-relaxed">
                  A dynamic curriculum that evolves with you. Our AI analyzes your pace and adjusts difficulty in real-time.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-6 md:p-8 rounded-3xl bg-gradient-to-b from-muted/50 to-muted/10 border border-white/10 hover:border-blue-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-background shadow-sm border border-border/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Instant Clarity</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Stuck? Get context-aware explanations in under 2 seconds. It's like having a tutor in your pocket.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-6 text-center relative z-10 border-t border-border/40 bg-background/50 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs font-medium text-muted-foreground/60">
          <span className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
            <Command className="w-3 h-3" /> Press ⌘K to search
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
          <span className="hidden md:inline">•</span>
          <span>© {new Date().getFullYear()} Inc.</span>
        </div>
      </footer>

      {/* Tailwind Config for Animations (Add this to your tailwind.config.js or global css) 
          If you can't edit config, this style block handles the shimmer
      */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;