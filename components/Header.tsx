// Header.tsx
import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { LanguageSelector } from "@/components/languageSelector";
import { Sidebar } from "@/components/siderbar";
import { ModeToggle } from "./ui/modeToggle";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
// import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSources, setShowSources] = useState(false);
  // const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const toggleSources = () => {
  //   setShowSources(!showSources);
  // };

  return (
    <header className="sticky top-0 z-10 bg-white border-b dark:bg-[#212121]">
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
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-semibold text-[#6766FC]">Zoona</h1>
            {/* <span className="flex text-3xl font-extrabold">
              <Image
                src="/zoona_logo.png"
                alt="Zoona Logo"
                width={40}
                height={40}
              />
            </span> */}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
