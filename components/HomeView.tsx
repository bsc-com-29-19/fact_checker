// HomeView.tsx
import { useCoAgent } from "@copilotkit/react-core";
import { useState } from "react";
import { CornerDownLeftIcon } from "lucide-react";

import RecordingView from "@/components/RecordView";
import { AgentSelector } from "@/components/agentSelector";
// import { ModelSelector } from "@/components/modelSelector";
import Button from "@/components/button";

import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textArea";
import { useResearchContext } from "@/lib/research-provider";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { AgentState } from "@/lib/types";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";

export default function HomeView() {
  const { setResearchQuery, researchInput, setResearchInput, researchQuery } =
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

  const handleResearch = async (query: string) => {
    if (!query.trim()) return;
    setResearchQuery(query);
    setResearchInput("");
    await runResearchAgent(() => {
      return new TextMessage({
        role: MessageRole.User,
        content: query,
      });
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-20vh)] justify-center">
      <main className="bg-white dark:bg-[#212121]">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {!researchQuery && (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
              What do you want to fact check ?
            </h1>
          )}

          <div
            className={cn(
              "w-full bg-slate-100/50 dark:bg-[#303030] dark:border-none border shadow-sm rounded-md transition-all border-gray-300",
              { "ring-1 ring-slate-300": isInputFocused }
            )}
          >
            <Textarea
              placeholder="Enter your claim here..."
              className="bg-transparent p-8 md:p-10 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 w-full"
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

            {/* --- NEW RESPONSIVE FOOTER --- */}
            <div className="flex items-center justify-between gap-4 p-4">
              {/* Left Group: Agent & Model Selectors */}
              <div className="flex items-center gap-2 md:gap-4">
                <AgentSelector />
                {/* <ModelSelector /> */}
              </div>

              {/* Right Group: Actions & Info */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Character count is hidden on the very smallest screens */}
                <span className="hidden sm:inline text-xs text-slate-500">
                  {researchInput.length} / {MAX_INPUT_LENGTH}
                </span>
                <RecordingView
                  onTranscriptChange={(transcript) =>
                    setResearchInput(transcript)
                  }
                />
                <Button onClick={() => handleResearch(researchInput)}>
                  {/* Text "Check" is hidden on mobile */}
                  <span className="hidden md:inline text-sm px-2">Check</span>
                  <CornerDownLeftIcon className="w-4 h-3 md:ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
