//page.tsx
"use client";

import { ResearchProvider } from "@/lib/research-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { ResearchWrapper } from "@/components/ResearchWrapper";
import { ModelProvider } from "@/contexts/modelContext";
import { AgentProvider } from "@/contexts/agentContext";
import { LanguageProvider } from "@/contexts/languageContext";
import { Header } from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";

export default function ModelSelectorWrapper() {
  return (
    <main>
      <ThemeProvider>
        <ModelProvider>
          <LanguageProvider>
            <Header />
            <Home />
          </LanguageProvider>
        </ModelProvider>
      </ThemeProvider>
    </main>
  );
}
function Home() {
  return (
    <CopilotKit runtimeUrl={"/api/copilotkit"} agent="fact_checker_agent">
      <AgentProvider>
        <ResearchProvider>
          <ResearchWrapper />
        </ResearchProvider>
      </AgentProvider>
    </CopilotKit>
  );
}
