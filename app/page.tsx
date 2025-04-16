//page.tsx
"use client";
import { ResearchProvider } from "@/lib/research-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { ModelProvider } from "@/contexts/modelContext";
import { AgentProvider } from "@/contexts/agentContext";
import { LanguageProvider } from "@/contexts/languageContext";
import { Header } from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchWrapper } from "@/components/ResearchWrapper";

export default function ModelSelectorWrapper() {
  return (
    <ThemeProvider>
      <ModelProvider>
        <LanguageProvider>
          <Header />
          <Home />
        </LanguageProvider>
      </ModelProvider>
    </ThemeProvider>
  );
}

function Home() {
  return (
    <CopilotKit runtimeUrl={"/api/copilotkit"} agent="fact_checker_agent">
      <AgentProvider>
        <ResearchProvider>
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="Answer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Answer">Answer</TabsTrigger>
                <TabsTrigger value="Source">Source</TabsTrigger>
              </TabsList>
              
              <TabsContent value="Answer" className="pt-4">
                <ResearchWrapper />
              </TabsContent>
              
              <TabsContent value="Source" className="pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {/* Source content will be rendered here */}
                  <p>Sources will appear here ......</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResearchProvider>
      </AgentProvider>
    </CopilotKit>
  );
}
