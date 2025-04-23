
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

interface Reference {
  title: string;
  url: string;
  score?: number;
}

export function ResultsView() {
  const { researchQuery } = useResearchContext();
  const { model } = useModel();
  const { agent } = useAgent();

  const [activeTab, setActiveTab] = useState("results");
  const [parsedResults, setParsedResults] = useState({
    trueStatement: "",
    falseStatement: "",
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

      let trueStatement = "";
      let falseStatement = "";
      let wholeTruth = "";
      let currentSection: string | null = null;

      for (const line of lines) {
        if (line.toLowerCase().startsWith("true:")) {
          currentSection = "true";
          trueStatement = line.substring("true:".length).trim();
        } else if (line.toLowerCase().startsWith("false:")) {
          currentSection = "false";
          falseStatement = line.substring("false:".length).trim();
        } else if (line.toLowerCase().startsWith("whole truth:")) {
          currentSection = "wholeTruth";
          wholeTruth = line.substring("whole truth:".length).trim();
        } else {
          if (currentSection === "true" && line) {
            trueStatement += (trueStatement ? "\n" : "") + line;
          } else if (currentSection === "false" && line) {
            falseStatement += (falseStatement ? "\n" : "") + line;
          } else if (currentSection === "wholeTruth" && line) {
            wholeTruth += (wholeTruth ? "\n" : "") + line;
          }
        }
      }

      // Use either ranked_sources or answer.sources if available
      const references: Reference[] = (agentState?.ranked_sources || []).map((source: any) => ({
        title: source.title,
        url: source.url,
        score: source.score || 0
      }));
    console.log(agentState.ranked_sources)
      setParsedResults({
        trueStatement,
        falseStatement,
        wholeTruth,
        references,
      });
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

  const tabs = [
    { name: "Results", value: "results" },
    { name: "Sources", value: "sources" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full flex-col my-8 h-full">
        <div className="space-y-4 flex justify-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-2xl lg:text-3xl font-normal"> Claim : </h1>
            <h1 className="text-2xl lg:text-3xl font-extralight  items-center">
              {researchQuery}
            </h1>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="w-full p-0 bg-background flex justify-center border-b rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none flex bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#6766FC] mb-4"
              >
                <code className="text-[20px] flex gap-4">
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
                <h1 className="font-bold text-3xl">
                    {`User's Claim Decomposition`}
                  </h1>
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700">
                        True Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {parsedResults.trueStatement ||
                          "No true statements found"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-700">
                        False Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {parsedResults.falseStatement ||
                          "No false statements found"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700">
                        Whole Truth
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
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                          >
                            {reference.title || `Reference ${index + 1}`}
                            {reference.score !== undefined && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Score: {reference.score})
                              </span>
                            )}
                          </a>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600">
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {reference.url}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
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
