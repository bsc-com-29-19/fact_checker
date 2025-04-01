// contexts/LanguageContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es" | "fr" | "de" |"ch" ; // Add more as needed
type LanguageName = "English" | "Spanish" | "French" | "German" |"Chichewa";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languageName: LanguageName;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const languageMap: Record<Language, LanguageName> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ch: "Chichewa",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en"); // Default language

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languageName: languageMap[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
