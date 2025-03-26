"use client";

import { useState } from "react";
import { Moon, Sun, Plus } from "lucide-react";
import { Sidebar } from "@/components/siderbar";
import CustomHeader from "@/components/CustomHeader";
// import { CustomAssistantMessage } from "@/components/assist";
import { CopilotChat, CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
// import { CustomUserMessage } from "@/components/user";
import CustomInput from "@/components/CustomInput";
import CustomWindow from "@/components/CustomWindow";
import FactCheckComponent from "@/components/main";
import { CopilotKit } from "@copilotkit/react-core";
export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const factCheckData = {
    claim: "Tom's restaurant closed because of health violations",
    trueStatement: "Tom's restaurant closed.",
    falseStatement: "It closed solely because of health violations",
    wholeTruth:
      "Tom's restaurant did close, and the closure was primarily due to gross mismanagement from Tom's corporate office, as reported. While Tom cited leasing issues as the reason, evidence suggests that the space was secured well into the next spring, making the leasing claim questionable. Financial difficulties and poor management decisions appear to be the main reasons for the restaurant's abrupt closure, leaving staff with no severance and minimal notice.",
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const inputEmelent = () => null;

  return (
    <>
      <div
        className={`min-h-screen ${
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
        <div className="flex">
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-64" : "w-0"
            }`}
          ></div>
          <div
            className={`flex-1 transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <div className="p-4">
              <FactCheckComponent
                claim={factCheckData.claim}
                trueStatement={factCheckData.trueStatement}
                falseStatement={factCheckData.falseStatement}
                wholeTruth={factCheckData.wholeTruth}
              />

              <CopilotSidebar
                Input={inputEmelent}
                defaultOpen={true}
                clickOutsideToClose={false}
                showResponseButton={false}
                Header={CustomHeader}
                Window={CustomWindow}
              />
              {/* <CopilotChat
                showResponseButton={false}
                AssistantMessage={CustomAssistantMessage}
                UserMessage={CustomUserMessage}
                Input={CustomInput}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
