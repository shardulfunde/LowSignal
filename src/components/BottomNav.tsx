import { Home, BookOpen, MessageCircle, Users, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('bottomNav.home'), path: "/home" },
    { icon: BookOpen, label: t('bottomNav.learn'), path: "/learning-paths" },
    { icon: MessageCircle, label: t('bottomNav.chat'), path: "/study-chat" },
    { icon: Trophy, label: t('bottomNav.ranks'), path: "/leaderboard" },
    { icon: Users, label: t('bottomNav.community'), path: "/community" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-border shadow-lg">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-muted-foreground transition-colors touch-target min-w-[64px]"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
