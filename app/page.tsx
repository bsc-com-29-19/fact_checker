'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { MenuSquareIcon, Moon, Sun, X } from 'lucide-react';
import { CustomInput } from "../components/customInput";
import { CopilotKit } from "@copilotkit/react-core";
import { Message } from "@copilotkit/runtime-client-gql";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false); // Controls the right sidebar

  const handleSend = async (text: string): Promise<Message> => {
    console.log("User input:", text);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "1",
          text: text,
          timestamp: new Date(),
        });
      }, 1000);
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-300 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button (Left Sidebar) */}
          <button 
            className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuSquareIcon size={25} />
          </button>
          <h1 className="text-xl font-bold">Fact Checker</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Sources Button (Right Sidebar) */}
          <button 
            onClick={() => setIsSourcesOpen(!isSourcesOpen)} 
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Source
          </button>

          {/* Profile Button */}
          <button className="p-2 rounded-full bg-blue-500 text-white">MK</button>
        </div>
      </nav>

      {/* Left Sidebar (Your Searches) */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Searches</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={30} />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="p-2 rounded hover:bg-gray-700 cursor-pointer"></li>
        </ul>
      </motion.div>

      {/* Right Sidebar (Sources) */}
      <motion.div 
        initial={{ x: 250 }}
        animate={{ x: isSourcesOpen ? 0 : 250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 right-0 h-full w-64 bg-gray-800 text-white p-4 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sources</h2>
          <button onClick={() => setIsSourcesOpen(false)}>
            <X size={30} />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="p-2 rounded hover:bg-gray-700 cursor-pointer"></li>
        </ul>
      </motion.div>

      {/* Overlay (closes sidebars when clicked) */} 
      {(isSidebarOpen || isSourcesOpen) && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsSourcesOpen(false);
          }}
        ></div>
      )}

      {/* Main Content Centered */}
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">What do you want to fact check?</h1>
        <CopilotKit publicApiKey="ck_pub_0638cd0f6d605e5bc03f086a25daab99">
          <CustomInput
            inProgress={false}
            onSend={handleSend}
            isVisible={true}
          />
        </CopilotKit>
      </div>
    </div>
  );
}
