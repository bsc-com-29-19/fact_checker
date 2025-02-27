'use client';

import { useState } from "react";
import { Moon, Sun, Plus, Send, RefreshCcw } from 'lucide-react';
export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSources, setShowSources] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-300 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
            <Plus size={20} />
          </button>
          <h1 className="text-xl font-bold">Fact Checker</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 rounded-full bg-blue-500 text-white">SG</button>
        </div>
      </nav>
      </div>

     );
}