// components/LanguageSelector.tsx
"use client";

import { useLanguage } from "@/contexts/languageContext";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, languageName } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
        <Globe size={16} />
        {languageName}
      </button>

      <div className="absolute right-0 z-10 hidden w-32 mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800 group-hover:block">
        <LanguageOption
          code="en"
          name="English"
          current={language}
          setLanguage={setLanguage}
        />
        <LanguageOption
          code="es"
          name="Español"
          current={language}
          setLanguage={setLanguage}
        />
        <LanguageOption
          code="fr"
          name="Français"
          current={language}
          setLanguage={setLanguage}
        />
        <LanguageOption
          code="de"
          name="Deutsch"
          current={language}
          setLanguage={setLanguage}
        />
      </div>
    </div>
  );
}

function LanguageOption({
  code,
  name,
  current,
  setLanguage,
}: {
  code: string;
  name: string;
  current: string;
  setLanguage: (code: string) => void;
}) {
  return (
    <button
      onClick={() => setLanguage(code)}
      className={`block w-full px-4 py-2 text-left text-sm ${
        current === code
          ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {name}
    </button>
  );
}
