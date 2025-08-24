import React from "react";
import { LanguageSelector } from "@/components/languageSelector";
import { ModeToggle } from "./ui/modeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-[#212121]">
      <div className="flex justify-between items-center p-4">
        {/* Left Side: Brand Name - adjusts font size responsively */}
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-semibold text-[#6766FC]">Ngamo</h1>
        </div>

        {/* Right Side: Action Icons */}
        {/* The space between icons is smaller on mobile and larger on desktop */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
