//HomeView.tsx
import { useCoAgent } from "@copilotkit/react-core";
import { useEffect, useState } from "react";
import { Moon, Sun, Plus, X, CornerDownLeftIcon } from "lucide-react";
import { Sidebar } from "@/components/siderbar";
import CustomHeader from "@/components/CustomHeader";
import { CustomAssistantMessage } from "@/components/CustomAssistantMessage";
import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
import { CustomUserMessage } from "@/components/CustomUserMessage";
import CustomWindow from "@/components/CustomWindow";
import { AgentSelector } from "@/components/agentSelector";
import { ModelSelector } from "@/components/modelSelector";
import FactCheckComponent from "@/components/main";
import Ranking from "@/components/Ranking";
import Button from "@/components/button";
import { LanguageSelector } from "@/components/languageSelector";
import { GiHamburgerMenu } from "react-icons/gi";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textArea";
import { useResearchContext } from "@/lib/research-provider";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { AgentState } from "@/lib/types";
import { Agent } from "http";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";

export default function HomeView() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const { setResearchQuery, researchInput, setResearchInput } =
    useResearchContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { model } = useModel();
  const { agent } = useAgent();

  // const factCheckData = {
  //   claim: "Tom's restaurant closed because of health violations",
  //   trueStatement: "Tom's restaurant closed.",
  //   falseStatement: "It closed solely because of health violations",
  //   wholeTruth: "Tom's restaurant did close..................",
  // };

  const sources = [
    { title: "News Report", url: "https://example.com/news" },
    { title: "Government Report", url: "https://example.com/gov" },
    { title: "Health Inspection Document", url: "https://example.com/health" },
  ];

  const MAX_INPUT_LENGTH = 500;
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSources = () => {
    setShowSources(!showSources);
  };

  const { run: runResearchAgent } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
    },
  });

  const handleResearch = (query: string) => {
    setResearchQuery(query);
    runResearchAgent(() => {
      return new TextMessage({
        role: MessageRole.User,
        content: query,
      });
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sources Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-200 dark:bg-gray-900 shadow-lg transform ${
          showSources ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sources</h2>
            <button
              onClick={toggleSources}
              className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Sidebar - Now with internal close button */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-100 dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-10`}
      >
        <div className="h-full overflow-y-auto relative">
          {/* Close button inside sidebar */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 z-20"
          >
            <X size={20} />
          </button>
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Sticky Header
          <header className="sticky top-0 z-10 bg-gray-300 dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-4">
                Only show hamburger menu when sidebar is closed
                {!isSidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                  >
                    <GiHamburgerMenu size={24} />
                  </button>
                )}
                <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
                  <Plus size={26} />
                </button>
                <h1 className="text-xl font-bold">Fact Checker</h1>
                <Button variant="primary" onClick={toggleSources}>
                  Sources
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <button
                  onClick={() => setDa,rkMode(!darkMode)}
                  className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <button className="p-2 rounded-full bg-blue-500 text-white">
                  MK
                </button>
              </div>
            </div>
          </header>
   */}
        {/* Scrollable Content */}
        <main className="bg-white dark:bg-gray-700 min-h-[calc(100vh-64px)]">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex space-x-2"></div>

            <h1 className="text-3xl font-bold text-center">
              What do you want to fact check ?
            </h1>

            {/* <Ranking /> */}

            <div
              className={cn(
                "w-full bg-slate-100/50 border shadow-sm rounded-md transition-all",
                {
                  "ring-1 ring-slate-300": isInputFocused,
                }
              )}
            >
              <Textarea
                placeholder="Enter your claim here...."
                className="bg-transparent p-4 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 w-full  "
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                value={researchInput}
                onChange={(e) => setResearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleResearch(researchInput);
                  }
                }}
                maxLength={MAX_INPUT_LENGTH}
              />
              <div className="text-xs p-4 flex items-center justify-between">
                <div
                  className={cn(
                    "transition-all duration-300 mt-4 text-slate-500",
                    {
                      // "opacity-0": !researchInput,
                      "opacity-100": researchInput,
                    }
                  )}
                >
                  <AgentSelector />
                  <ModelSelector />
                  {researchInput.length} / {MAX_INPUT_LENGTH}
                </div>
                <Button onClick={() => handleResearch(researchInput)}>
                  Check
                  <CornerDownLeftIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Copilot Sidebar */}
      {/* <div className="fixed right-0 top-0 h-full">
          <CopilotSidebar
            defaultOpen={true}
            clickOutsideToClose={false}
            Input={() => null}
            Header={CustomHeader}
            Window={CustomWindow}
          />
        </div> */}
    </div>
  );
}
