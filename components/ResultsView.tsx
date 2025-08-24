// ResultsView.tsx
"use client";

import { useResearchContext } from "@/lib/research-provider";
import { motion } from "framer-motion";
import { LoaderCircleIcon, SparkleIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";
import { AgentState } from "@/lib/types";
import { useState, useEffect } from "react";
import { Progress1 } from "./progress1";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SourceCard } from "@/components/SourceCard"; // Import the new component
import { useMediaQuery } from "@/hooks/use-media-query";

interface Reference {
  title: string;
  url: string;
  score?: number;
}

export function ResultsView() {
  const { researchQuery } = useResearchContext();
  const { model } = useModel();
  const { agent } = useAgent();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [activeTab, setActiveTab] = useState("results");
  const [parsedResults, setParsedResults] = useState({
    classification: "",
    wholeTruth: "",
    references: [] as Reference[],
  });

  const { state: agentState } = useCoAgent<AgentState>({
    name: agent,
    initialState: { model },
  });

  useEffect(() => {
    if (agentState?.answer?.markdown) {
      const markdown = agentState.answer.markdown;
      const lines = markdown.split("\n").map((line) => line.trim());
      let classification = "",
        wholeTruth = "",
        references: Reference[] = [];

      for (const line of lines) {
        // Simplified parsing logic
        if (line.toLowerCase().startsWith("classification:")) {
          classification = line
            .substring("classification:".length)
            .trim()
            .toLowerCase();
        } else if (line.toLowerCase().startsWith("whole truth:")) {
          wholeTruth = line.substring("whole truth:".length).trim();
        } else if (wholeTruth) {
          // Append subsequent lines to wholeTruth
          wholeTruth += "\n" + line;
        }
      }

      references = (agentState?.ranked_sources || []).map((source: any) => ({
        title: source.title,
        url: source.url,
        score: source.score || 0,
      }));

      setParsedResults({ classification, wholeTruth, references });
    }
  }, [agentState?.answer, agentState?.ranked_sources]);

  const steps =
    agentState?.steps?.map((step: any) => ({
      description: step.description || "",
      status: step.status || "pending",
      updates: step.updates || [],
    })) || [];

  useCoAgentStateRender<AgentState>(
    { name: agent, render: () => <Progress1 steps={steps} /> },
    [agentState]
  );

  const isLoading = !agentState?.answer;
  const classificationColors = () => {
    switch (parsedResults.classification) {
      case "true":
        return {
          border: "border-green-200",
          bg: "bg-green-50 dark:bg-green-50/5",
          text: "text-green-700",
          label: "True Claim",
        };
      case "false":
        return {
          border: "border-red-200",
          bg: "bg-red-50 dark:bg-red-50/5",
          text: "text-red-700",
          label: "False Claim",
        };
      case "opinionated":
        return {
          border: "border-yellow-200",
          bg: "bg-yellow-50 dark:bg-yellow-50/5",
          text: "text-yellow-700",
          label: "Opinionated Claim",
        };
      default:
        return {
          border: "border-blue-200",
          bg: "bg-blue-50 dark:bg-blue-50/5",
          text: "text-blue-700",
          label: "Claim Assessment",
        };
    }
  };
  const colors = classificationColors();

  const tabs = [
    { name: "Results", value: "results" },
    { name: "Sources", value: "sources" },
  ];

  const MobileProgressView = () => (
    // This will only be rendered if !isDesktop and isLoading are true
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {/* <LoaderCircleIcon className="animate-spin w-5 h-5 text-[#6766FC]" /> */}
          Realtime Agent Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress1 steps={steps} />
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-0" // Add padding for mobile
    >
      <div className="w-full flex-col  md:my-8 h-full">
        {/* Claim Header: Now wraps on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-4 mb-4 text-center sm:text-left">
          <h1 className="text-xl md:text-2xl font-normal">Claim:</h1>
          <h1 className="text-xl md:text-2xl font-extralight">
            {researchQuery}
          </h1>
        </div>
        {isLoading && !isDesktop && <MobileProgressView />}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="w-full p-0 flex justify-center border-b rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 sm:flex-initial rounded-none dark:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#6766FC] mb-4"
              >
                <code className="text-base md:text-lg flex items-center gap-2">
                  {isLoading && activeTab === tab.value ? (
                    <LoaderCircleIcon className="animate-spin w-4 h-4 text-[#6766FC]" />
                  ) : (
                    <SparkleIcon className="w-4 h-4 text-slate-500" />
                  )}
                  {tab.name}
                </code>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="results" className="mt-6">
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">Loading results...</div>
              ) : (
                <>
                  <h1 className="font-bold text-2xl md:text-3xl">
                    Claim Analysis
                  </h1>
                  <Card className={`${colors.border} ${colors.bg}`}>
                    <CardHeader>
                      <CardTitle className={colors.text}>
                        {colors.label}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-400/5 dark:text-white">
                    <CardHeader>
                      <CardTitle className="text-blue-700">
                        {parsedResults.classification === "opinionated"
                          ? "Supporting Arguments"
                          : "Whole Truth"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {parsedResults.wholeTruth ||
                          "No overall assessment available"}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading sources...</div>
            ) : (
              <div className="space-y-4">
                {parsedResults.references.length ? (
                  parsedResults.references.map((reference, index) => (
                    <SourceCard
                      key={index}
                      reference={reference}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">No sources available</div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
