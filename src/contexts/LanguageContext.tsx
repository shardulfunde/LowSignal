import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/utils/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('lowsignal_language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'mr')) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('lowsignal_language', lang);
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        // Use English for Marathi since translations are not yet available
        const effectiveLanguage = language === 'mr' ? 'en' : language;
        let current: any = translations[effectiveLanguage];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${effectiveLanguage}`);
                // Fallback to English
                let fallback: any = translations['en'];
                for (const k of keys) {
                    if (fallback[k] === undefined) return path;
                    fallback = fallback[k];
                }
                return fallback;
            }
            current = current[key];
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
