//CustomWindow.tsx
"use client";

import { WindowProps, useChatContext } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-ui/styles.css";
import { Progress } from "@/components/progress";
import { useCoAgent } from "@copilotkit/react-core";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";
import { AgentState } from "@/lib/types";


export default function CustomWindow({ children }: WindowProps) {
  const { open, setOpen } = useChatContext();
  const { model } = useModel();
  const { agent } = useAgent();

  // Get agent state for progress tracking
  const { state: agentState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
    },
  });

  const steps =
    agentState?.steps?.map((step: any) => {
      return {
        description: step.description || "",
        status: step.status || "pending",
        updates: step.updates || [],
      };
    }) || [];

  if (!open) return null;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 h-full w-96" // added margin-top to push below header
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Progress bar at the top */}
          {/* <div className="p-4 border-b"></div> */}
          <Progress steps={steps} />

          <div className="flex flex-col h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
