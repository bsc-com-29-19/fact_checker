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
import { formatDate } from "@/lib/date-formatter";

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
    classification: "",
    wholeTruth: "",
    references: [] as Reference[],
  });

  const { state: agentState } = useCoAgent<AgentState>({
    name: agent,
    initialState: { model },
  });

  const today = new Date();

  useEffect(() => {
    if (agentState?.answer?.markdown) {
      const markdown = agentState.answer.markdown;

      const lines = markdown.split("\n").map((line) => line.trim());

      let classification = "";
      let trueStatement = "";
      let falseStatement = "";
      let wholeTruth = "";
      let currentSection: string | null = null;

      for (const line of lines) {
        if (line.toLowerCase().startsWith("classification:")) {
          classification = line
            .substring("classification:".length)
            .trim()
            .toLowerCase();
          continue;
        }
        // if (line.toLowerCase().startsWith("true:")) {
        //   currentSection = "true";
        //   trueStatement = line.substring("true:".length).trim();
        // } else if (line.toLowerCase().startsWith("false:")) {
        //   currentSection = "false";
        //   falseStatement = line.substring("false:".length).trim();
        // } else
        if (line.toLowerCase().startsWith("whole truth:")) {
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
      const references: Reference[] = (agentState?.ranked_sources || []).map(
        (source: any) => ({
          title: source.title,
          url: source.url,
          score: source.score || 0,
        })
      );
      // console.log(agentState.ranked_sources);
      setParsedResults({
        classification,
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
          className="w-full max-w-4xl mx-auto "
        >
          <TabsList className="w-full p-0  flex justify-center border-b rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none dark:bg-transparent flex h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#6766FC] mb-4"
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
                  <h1 className="font-bold text-3xl">Claim Analysis</h1>
                  {/* <Card className="border-green-200 bg-green-50">
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
                  </Card> */}

                  {/* <Card className="border-red-200 bg-red-50">
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
                  </Card> */}
                  {/* <Card className={`${colors.border} ${colors.bg}`}>
                    <CardHeader>
                      <CardTitle className={colors.text}>
                        {parsedResults.classification === "opinionated"
                          ? "Opinionated Statement"
                          : "Whole Truth"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {parsedResults.wholeTruth ||
                          "No overall assessment available"}
                      </div>
                    </CardContent>
                  </Card> */}
                  {/* Classification Card */}
                  <Card className={`${colors.border} ${colors.bg}`}>
                    <CardHeader>
                      <CardTitle className={colors.text}>
                        {colors.label}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-400/5  dark:text-white">
                    <CardHeader>
                      <CardTitle className="text-blue-700">
                        {parsedResults.classification === "opinionated"
                          ? "Supporting Arguements"
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

          {/* <TabsContent value="sources" className="mt-6">
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
          </TabsContent> */}
          <TabsContent value="sources" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading sources...</div>
            ) : (
              <div className="space-y-4">
                {parsedResults.references.length ? (
                  parsedResults.references.map((reference, index) => {
                    // const credibility =
                    //   reference.score >= 75
                    //     ? "High"
                    //     : reference.score >= 50
                    //     ? "Medium"
                    //     : "Low";
                    // const bias =
                    //   reference.score >= 75
                    //     ? "Low"
                    //     : reference.score >= 50
                    //     ? "Medium"
                    //     : "High";
                    // First check if score exists
                    const safeScore = reference?.score ?? 0;

                    const credibility =
                      safeScore >= 75
                        ? "High"
                        : safeScore >= 50
                        ? "Medium"
                        : "Low";

                    const bias =
                      safeScore >= 75
                        ? "Low"
                        : safeScore >= 25
                        ? "Medium"
                        : "High";

                    return (
                      <Card
                        key={index}
                        className="group hover:border-[#6766FC]/30 dark:border-transparent transition-colors hover:bg-[#6766FC]/5 dark:hover:bg-[#303030]"
                      >
                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                          <div className="space-y-2 flex-1">
                            <CardTitle className="text-base font-semibold ">
                              <a
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black dark:text-white hover:text-[#6766FC] transition-colors"
                              >
                                {reference.title || `Reference ${index + 1}`}
                              </a>
                            </CardTitle>
                            <div className="text-sm">
                              <a
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-white/80 hover:text-[#6766FC] break-all transition-colors"
                              >
                                {reference.url}
                              </a>
                            </div>
                            <div className="text-sm text-gray-500 font-normal dark:text-white">
                              <span className="text-gray-500 font-normal dark:text-white">
                                {formatDate(today)}
                              </span>
                            </div>
                          </div>

                          {/* Right-aligned metrics column */}
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            {reference.score !== undefined && (
                              <div className="text-right flex items-center gap-2">
                                <div className="text-md text-gray-500 dark:text-white/50">
                                  Score :
                                </div>
                                <div className="text-black dark:text-white font-medium">
                                  {reference.score}
                                </div>
                              </div>
                            )}
                            <div
                              className={`text-xs px-2 py-1 rounded-md ${
                                credibility === "High"
                                  ? "bg-green-100 text-green-800 font-bold"
                                  : credibility === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 font-bold"
                                  : "bg-red-100 text-red-800 font-bold"
                              }`}
                            >
                              Credibility: {credibility}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-md ${
                                bias === "Low"
                                  ? "bg-blue-100 text-blue-800 font-bold"
                                  : bias === "Medium"
                                  ? "bg-purple-100 text-yellow-800 font-bold"
                                  : "bg-pink-100 text-pink-800 font-bold"
                              }`}
                            >
                              Bias: {bias}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })
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
