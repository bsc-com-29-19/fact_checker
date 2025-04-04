"use client";


import { ResearchProvider } from "@/lib/research-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { ResearchWrapper } from "@/components/ResearchWrapper";
import { useCoAgent } from "@copilotkit/react-core";
import { ModelProvider, useModel } from "@/contexts/modelContext";
import { ModelSelector } from "@/components/modelSelector";
import { AgentProvider } from "@/contexts/agentContext";
import { LanguageProvider } from "@/contexts/languageContext";

export default function ModelSelectorWrapper(){
  return (
    <main className="flex justify-center">
      <ModelProvider>
        <Home/>
        {/* <ModelSelector/> */}
      </ModelProvider>
    </main>
  )
}
function Home() {
  // const { useLgc } = useModel();
  return (
      <CopilotKit runtimeUrl={"/api/copilotkit"} agent="fact_checker_agent">
        <AgentProvider>
          <LanguageProvider>
        <ResearchProvider>
          
          <ResearchWrapper />
        </ResearchProvider>
        </LanguageProvider>
        </AgentProvider>
      </CopilotKit>
  );
}

// function useModelSelectorContext(): { useLgc: any; } {
//   throw new Error("Function not implemented.");
// }

