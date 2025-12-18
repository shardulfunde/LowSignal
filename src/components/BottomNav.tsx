import { Home, BookOpen, MessageCircle, Users, Trophy, Lock } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils"; // Assuming you have a standard cn utility, if not, standard template literals work too

const BottomNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { 
      icon: Home, 
      label: t('bottomNav.home'), 
      path: "/home", 
      disabled: false 
    },
    { 
      icon: BookOpen, 
      label: t('bottomNav.learn'), 
      path: "/learning-paths", 
      disabled: false 
    },
    // 🔒 DISABLED ITEMS
    { 
      icon: MessageCircle, 
      label: t('bottomNav.chat'), 
      path: "/study-chat", 
      disabled: false // Greyed out as requested
    },
    { 
      icon: Trophy, 
      label: t('bottomNav.ranks'), 
      path: "/leaderboard", 
      disabled: true // Greyed out
    },
    { 
      icon: Users, 
      label: t('bottomNav.community'), 
      path: "/community", 
      disabled: true // Greyed out
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-t border-border shadow-lg pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          // 1. RENDER DISABLED STATE (Static Div)
          if (item.disabled) {
            return (
              <div
                key={item.path}
                className="relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-muted-foreground/40 cursor-not-allowed select-none min-w-[64px]"
              >
                <div className="relative">
                  <item.icon className="w-6 h-6 grayscale" />
                  {/* Small Lock Badge */}
                  <div className="absolute -top-1 -right-2 bg-muted text-muted-foreground rounded-full p-[2px] border border-background">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                </div>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
            );
          }

          // 2. RENDER ACTIVE STATE (Your NavLink)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent/50 active:scale-95 touch-target min-w-[64px]"
              activeClassName="text-primary bg-primary/10 font-bold"
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-bold">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;