import React, { useState } from "react";
import Button from "./button";
import { Moon, Plus,  Sun } from "lucide-react";
import { LanguageSelector } from "@/components/languageSelector";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sidebar } from "@/components/siderbar"
import ThemeButton from "./ui/ThemeButton";

   export function Header(){
            const [darkMode, setDarkMode] = useState(false);
            const [isSidebarOpen, setIsSidebarOpen] = useState(false);
            const [showSources, setShowSources] = useState(false);




             const toggleSidebar = () => {
                  setIsSidebarOpen(!isSidebarOpen);
                };
              
                const toggleSources = () => {
                  setShowSources(!showSources);
                };

            return (
                <React.Fragment>
  <header className="fixed sticky top-0 z-10 ">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-4">  
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
                  {!isSidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                  >
                  
                  </button>
                )}
              
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                 {/* <ThemeButton /> */}
                <button className="p-2 rounded-full bg-blue-500 text-white">
                  MK
                </button>
              </div>
            </div>
          </header>
                </React.Fragment>
            )
        
   }