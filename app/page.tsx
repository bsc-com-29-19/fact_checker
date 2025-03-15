'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { MenuSquareIcon, Moon, Sun, Plus, X } from 'lucide-react';
import { CustomInput } from "../components/customInput";
import { CopilotKit } from "@copilotkit/react-core";
import { Message } from "@copilotkit/runtime-client-gql";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          {/* Sidebar Toggle Button */}
          <button 
            className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuSquareIcon size={25} />
          </button>
          <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
            <Plus size={25} />
          </button>
          <h1 className="text-xl font-bold">Fact Checker</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 rounded-full bg-blue-500 text-white">MK</button>
        </div>
      </nav>

      {/* Sidebar (Animated) */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Searches</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={25} />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="p-2 rounded hover:bg-gray-700 cursor-pointer"></li>
          <li className="p-2 rounded hover:bg-gray-700 cursor-pointer"></li>
          <li className="p-2 rounded hover:bg-gray-700 cursor-pointer"></li>
        </ul>
      </motion.div>

      {/* Overlay (when sidebar is open) */}
      {isSidebarOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
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
