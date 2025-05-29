// ClaimInput.tsx
import { useCoAgent } from "@copilotkit/react-core";
import { useState } from "react";
import { CornerDownLeftIcon } from "lucide-react";
import RecordingView from "@/components/RecordView";
import { AgentSelector } from "@/components/agentSelector";
import { ModelSelector } from "@/components/modelSelector";
import Button from "@/components/button";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textArea";
import { useResearchContext } from "@/lib/research-provider";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { AgentState } from "@/lib/types";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";

export function ClaimInput() {
  const { setResearchQuery, researchInput, setResearchInput } =
    useResearchContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { model } = useModel();
  const { agent } = useAgent();
  const MAX_INPUT_LENGTH = 500;

  const { run: runResearchAgent } = useCoAgent<AgentState>({
    name: agent,
    initialState: { model },
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
    <div
      className={cn(
        "w-full bg-slate-100/50 border shadow-sm rounded-md transition-all border-gray-300",
        { "ring-1 ring-slate-300": isInputFocused }
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
        <div className="col-span-1 flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {researchInput.length} / {MAX_INPUT_LENGTH}
          </span>
          <AgentSelector />
        </div>
        <div className="col-span-1 flex justify-center">
          <ModelSelector />
        </div>
        <div className="col-span-1 flex justify-end items-center gap-4">
          <RecordingView
            onTranscriptChange={(transcript) => setResearchInput(transcript)}
          />
          <Button onClick={() => handleResearch(researchInput)}>
            Check
            <CornerDownLeftIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}