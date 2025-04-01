//page.tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Plus, X } from "lucide-react";
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
import Button from "@/components/button";
import "@copilotkit/react-ui/styles.css";
//import { ModelSelector } from "@/components/ModelSelector";
import { ModelSelectorProvider, useModelSelectorContext } from "@/lib/model-selector-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { ResearchProvider } from "@/lib/research-provider";
import { ResearchWrapper } from "@/components/ResearchWrapper";

// export default function ModelSelectorWrapper() {
//   return (
//       <main className="flex flex-col items-center justify-between">
//         <ModelSelectorProvider>
//             <Home/>
//           <ModelSelector />
//         </ModelSelectorProvider>
//       </main>
//   );
// }

function Home() {
  const { useLgc } = useModelSelectorContext();

  return (
      <CopilotKit runtimeUrl={useLgc ? "/api/copilotkit-lgc" : "/api/copilotkit"} agent="fact_checker_agent">
        <ResearchProvider>
          <ResearchWrapper />
        </ResearchProvider>
      </CopilotKit>
  );
}

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const factCheckData = {
    claim: "Tom's restaurant closed because of health violations",
    trueStatement: "Tom's restaurant closed.",
    falseStatement: "It closed solely because of health violations",
    wholeTruth: "Tom's restaurant did close..................",
  };

  const sources = [
    { title: "News Report", url: "https://example.com/news" },
    { title: "Government Report", url: "https://example.com/gov" },
    { title: "Health Inspection Document", url: "https://example.com/health" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSources = () => {
    setShowSources(!showSources);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sources Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-200 dark:bg-gray-900 p-4 shadow-lg transform ${
          showSources ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sources</h2>
          <button onClick={toggleSources} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {sources.map((source, index) => (
            <li key={index}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
<nav className="w-full flex justify-between items-center p-4 bg-gray-300 dark:bg-gray-800">
  <div className="flex items-center gap-4">
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
      <Plus size={26} />
    </button>
    <h1 className="text-xl font-bold text-black dark:text-white">Fact Checker</h1>
    <Button variant="primary" onClick={toggleSources}>
      Sources
    </Button>
  </div>

  {/* Dark Mode + Profile Button */}
  <div className="flex items-center gap-2">
    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
      {darkMode ? <Sun size={30} /> : <Moon size={30} />}
    </button>
    <button className="p-2 rounded-full bg-blue-500 text-white">MK</button>
  </div>
</nav>


        {/* Main Content Container */}
        <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col gap-6">
          {/* Fact Checking Component */}
          <FactCheckComponent
            claim={factCheckData.claim}
            trueStatement={factCheckData.trueStatement}
            falseStatement={factCheckData.falseStatement}
            wholeTruth={factCheckData.wholeTruth}
          />

          {/* Ranking Component */}
          <Ranking />

          {/* Copilot Chat */}
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

        {/* Copilot Sidebar */}
        <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg">
          <CopilotSidebar defaultOpen={true} clickOutsideToClose={false} showResponseButton={false} Header={CustomHeader} Window={CustomWindow} />
        </div>
      </div>
    </div>
  );
}
