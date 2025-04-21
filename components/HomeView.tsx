import { useCoAgent } from "@copilotkit/react-core";
import { useState } from "react";
import { CornerDownLeftIcon } from "lucide-react";
import Button from "./button";
// import { Sidebar } from "@/components/siderbar";
// import CustomHeader from "@/components/CustomHeader";
// import { CustomAssistantMessage } from "@/components/CustomAssistantMessage";
// import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
// import { CustomUserMessage } from "@/components/CustomUserMessage";
// import CustomInput from "@/components/CustomInput";
// import CustomWindow from "@/components/CustomWindow";
import { AgentSelector } from "@/components/agentSelector";
import { ModelSelector } from "@/components/modelSelector";
// import FactCheckComponent from "@/components/main";
// import Ranking from "@/components/Ranking";
// import Button from "@/components/button";

import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textArea";
import { useResearchContext } from "@/lib/research-provider";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { AgentState } from "@/lib/types";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";

export default function HomeView() {
  const { setResearchQuery, researchInput, setResearchInput } =
    useResearchContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { model } = useModel();
  const { agent } = useAgent();

  const MAX_INPUT_LENGTH = 500;

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
    <div className="h-full">
      <div>
        <main className="bg-white dark:bg-gray-700 min-h-[calc(80vh-64px)]">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex space-x-2"></div>

            <h1 className="text-3xl font-bold text-center">
              What do you want to fact check?
            </h1>

            <div
              className={cn(
                "w-full bg-slate-100/50 border shadow-sm rounded-md transition-all border-gray-300",
                {
                  "ring-1 ring-slate-300": isInputFocused,
                }
              )}
            >
              <Textarea
                placeholder="Enter your claim here..."
                className="bg-transparent p-4 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 w-full"
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

              <div className="grid grid-cols-3 gap-4 p-4 items-center">
                {/* Left Section - Character count and Agent Selector */}
                <div className="col-span-1 flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    {researchInput.length} / {MAX_INPUT_LENGTH}
                  </span>
                  <AgentSelector />
                </div>

                {/* Center Section - Model Selector */}
                <div className="col-span-1 flex justify-center">
                  <ModelSelector />
                </div>

                {/* Column 3: Search button (right-aligned) */}
                <div className="col-span-1 flex justify-end">
                  <Button
                    onClick={() => handleResearch(researchInput)}
                  
                  >
                    Check
                    <CornerDownLeftIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
