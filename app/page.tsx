"use client";

import { useState } from "react";
import { Moon, Sun, Plus } from "lucide-react";
import { Sidebar } from "@/components/siderbar";
import CustomHeader from "@/components/CustomHeader";
import AgentIntegrator from "@/components/AgentIntegrator";
import { CustomAssistantMessage } from "@/components/CustomAssistantMessage";
import {
  CopilotChat,
  CopilotSidebar,
} from "@copilotkit/react-ui";
import { CustomUserMessage } from "@/components/CustomUserMessage";
import CustomInput from "@/components/CustomInput";
import CustomWindow from "@/components/CustomWindow";
import FactCheckComponent from "@/components/main";

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

  const toggleModelModal = () => {
    setShowModelModal(!showModelModal);
  };

  const handleModelSelection = (model: string) => {
    setSelectedModel(model);
    setShowModelModal(false); // Close modal after selection
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-300 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
            <Plus size={26} />
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
          <button className="p-2 rounded-full bg-blue-500 text-white">
            SG
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col gap-6">
          {/* Fact Checking Component */}
          <FactCheckComponent
            claim={factCheckData.claim}
            trueStatement={factCheckData.trueStatement}
            falseStatement={factCheckData.falseStatement}
            wholeTruth={factCheckData.wholeTruth}
          />

          {/* Copilot Chat - NOT Hidden Behind Anything */}
          <div className="h-[500px] w-full">
            <CopilotChat
              showResponseButton={false}
              AssistantMessage={CustomAssistantMessage}
              UserMessage={CustomUserMessage}
              Input={CustomInput}
            />
          </div>

        
          {/* AgentIntegrator - Retrieves Data Based on Selected Model */}
          <div className="mt-4">
            <AgentIntegrator selectedModel={selectedModel} />
          </div>
        </div>
      </div>

      {/* Copilot Sidebar */}
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
