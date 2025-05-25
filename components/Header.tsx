// Header.tsx
'use client'
import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { LanguageSelector } from "@/components/languageSelector";
import { Sidebar } from "@/components/siderbar";
import { ModeToggle } from "./ui/modeToggle";
import { GiHamburgerMenu } from "react-icons/gi";
// import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //const [showSources, setShowSources] = useState(false);
  // const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const toggleSources = () => {
  //   setShowSources(!showSources);
  // };

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded hover:bg-accent"
            >

              <GiHamburgerMenu />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-accent"
            aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun size={24} className="text-primary" />
            ) : (
              <Moon size={24} className="text-primary" />
            )}

          </button> */}
          <ModeToggle />
          <button className="p-2 rounded-full bg-primary text-primary-foreground">
            MK
          </button>
        </div>
      </div>
    </header>
  );
}
