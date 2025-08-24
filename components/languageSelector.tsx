//languageSelector.tsx
"use client";

import React from "react";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/languageContext";

export function LanguageSelector() {
  const { language, setLanguage, languageName } = useLanguage();

  return (
    <div className="">
      <Select
        value={language}
        onValueChange={(v: "en" | "es" | "fr" | "de" | "ch") => setLanguage(v)}
      >
        <SelectTrigger className="w-full md:w-[180px] justify-start md:justify-center gap-2">
          <Globe size={16} />
          <div className="hidden md:block">
            <SelectValue placeholder={languageName} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
          <SelectItem value="ch">Chichewa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
