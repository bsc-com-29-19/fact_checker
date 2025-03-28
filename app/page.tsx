"use client";

import { useState } from "react";
import { Moon, Sun, Plus } from "lucide-react";
import { Sidebar } from "@/components/siderbar";
import CustomHeader from "@/components/CustomHeader";
import AgentIntegrator from "@/components/AgentIntegrator";
import { CustomAssistantMessage } from "@/components/CustomAssistantMessage";
import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
import { CustomUserMessage } from "@/components/CustomUserMessage";
import CustomInput from "@/components/CustomInput";
import CustomWindow from "@/components/CustomWindow";
import FactCheckComponent from "@/components/main";
import Ranking from "@/components/Ranking";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showModelModal, setShowModelModal] = useState(false);

  const factCheckData = {
    claim: "Tom's restaurant closed because of health violations",
    trueStatement: "Tom's restaurant closed.",
    falseStatement: "It closed solely because of health violations",
    wholeTruth: "Tom's restaurant did close..................",
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-4 bg-gray-300 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
            <Plus size={26} />
          </button>
          <h1 className="text-xl font-bold text-black dark:text-white">
            Fact Checker
          </h1>
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

      {/* Main Content Container */}
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col gap-6">
        {/* Fact Checking Component */}
        <FactCheckComponent
          claim={factCheckData.claim}
          trueStatement={factCheckData.trueStatement}
          falseStatement={factCheckData.falseStatement}
          wholeTruth={factCheckData.wholeTruth}
        />

        {/* Ranking Component (Fixed Position) */}
        <Ranking />

        {/* Copilot Chat - Always Fully Visible */}
        <div className="h-[500px] w-full">
          <CopilotChat
            showResponseButton={false}
            AssistantMessage={CustomAssistantMessage}
            UserMessage={CustomUserMessage}
            Input={CustomInput}
          />
        </div>

        {/* AgentIntegrator */}
        <div className="mt-4">
          <AgentIntegrator selectedModel={selectedModel} />
        </div>
      </div>

      {/* Copilot Sidebar - Always Visible */}
      <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg">
        <CopilotSidebar
          defaultOpen={true}
          clickOutsideToClose={false}
          showResponseButton={false}
          Header={CustomHeader}
          Window={CustomWindow}
        />
      </div>
    </div>
  );
}
