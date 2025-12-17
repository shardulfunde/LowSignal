import { Globe, Wifi, WifiOff, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/utils/translations";

interface TopBarProps {
  language: string;
  isOnline: boolean;
  showBack?: boolean;
  title?: string;
  onLanguageChange?: (lang: string) => void;
}

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हिंदी", name: "Hindi" },
  { code: "mr", label: "मराठी", name: "Marathi" },
];

const TopBar = ({ language, isOnline, showBack, title, onLanguageChange }: TopBarProps) => {
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { setLanguage, t } = useLanguage();

  const handleLangSelect = (code: string) => {
    setLanguage(code as Language);
    setShowLangMenu(false);
    onLanguageChange?.(code);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-3 -ml-2 rounded-xl hover:bg-muted transition-colors touch-target"
              aria-label="Go back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-bold">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-base">L</span>
              </div>
              <span className="font-bold text-lg tracking-tight">LowSignal</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-semibold touch-target"
            >
              <Globe className="w-4 h-4" />
              <span>{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang.code)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold">{lang.label}</span>
                      <span className="text-sm text-muted-foreground">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Online/Offline indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold touch-target ${isOnline ? "online-badge" : "offline-badge"
              }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">{t('topBar.online')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 animate-pulse-soft" />
                <span className="hidden sm:inline">{t('topBar.offline')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
