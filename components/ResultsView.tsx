//ResultsView.tsx
"use client";

import { useResearchContext } from "@/lib/research-provider";
import { motion } from "framer-motion";
import { BookOpenIcon, LoaderCircleIcon, SparkleIcon } from "lucide-react";
// import { SkeletonLoader } from "./SkeletonLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { Progress } from "./progress";
import { AnswerMarkdown } from "./AnswerMarkdown";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";
import { AgentState } from "@/lib/types";
import { useState } from "react";
import { Progress1 } from "./progress1";

export function ResultsView() {
  const { researchQuery } = useResearchContext();
  const { model } = useModel();
  const { agent } = useAgent();
  //agent state
  const { state: agentState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
    },
  });

  //keeps track of the current agent processing state
  const steps =
    agentState?.steps?.map((step: any) => {
      return {
        description: step.description || "",
        status: step.status || "pending",
        updates: step.updates || [],
      };
    }) || [];

  // Handle progress rendering with co-agent state
  useCoAgentStateRender<AgentState>(
    {
      name: agent,
      // render: ({ state }) => {
      //   if (state.steps?.length > 0) {
      //     const steps = state.steps.map((step) => ({
      //       description: step.message,
      //       status: step.done ? "complete" : "pending",
      //       updates: [],
      //     }));
      //     return <Progress steps={steps} />;
      //   }
      //   return null;
      // },
      render: () => {
        return <Progress1 steps={steps} />;
      },
    },
    [agentState]
  );

  console.log("AGENT_STATE", agentState);

  const tabs: { name: string; value: string }[] = [
    {
      name: "Results",
      value: "results",
    },
    {
      name: "Sources",
      value: "sources",
    },
  ];

  const isLoading = !agentState?.answer?.markdown;

  console.log("is loading :", isLoading);

  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* <div className="max-w-[1000px] p-8 lg:p-4 flex flex-col gap-y-8 mt-4 lg:mt-6 text-sm lg:text-base">
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-extralight">
            {researchQuery}
          </h1>
        </div>

        <Progress steps={steps} />

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 flex flex-col">
            <h2 className="flex items-center gap-x-2">
              {isLoading ? (
                <LoaderCircleIcon className="animate-spin w-4 h-4 text-slate-500" />
              ) : (
                <SparkleIcon className="w-4 h-4 text-slate-500" />
              )}
              Answer
            </h2>

            <div className="text-slate-500 font-light">
              {isLoading ? (
                // (
                //     <SkeletonLoader />
                // )
                "Loading...."
              ) : (
                <AnswerMarkdown markdown={agentState?.answer?.markdown} /> // displays search results
              )}
            </div>
          </div>

          {agentState?.answer?.references?.length && (
            <div className="flex col-span-12 lg:col-span-4 flex-col gap-y-4 w-[200px]">
              <h2 className="flex items-center gap-x-2">
                <BookOpenIcon className="w-4 h-4 text-slate-500" />
                References
              </h2>
              <ul className="text-slate-900 font-light text-sm flex flex-col gap-y-2">
                {agentState?.answer?.references?.map(
                  (ref: any, idx: number) => (
                    <li key={idx}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {idx + 1}. {ref.title}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div> */}
      <div className="w-full flex-col my-8 h-full">
        <div className="space-y-4 flex justify-center">
          <h1 className="text-3xl lg:text-4xl font-extralight mb-4">
            {researchQuery}
          </h1>
        </div>
        <Tabs
          // defaultValue={tabs[0].value}
          // defaultValue={}
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-xs w-full flex-col mx-auto  mt-2"
        >
          <TabsList className="w-full p-0 bg-background  flex justify-center border-b rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none flex bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#6766FC] mb-4"
              >
                <code className="text-[20px] flex gap-4">
                  {isLoading && activeTab === tab.value ? (
                    <LoaderCircleIcon className="animate-spin w-4 h-4 text-[#6766FC] data-[state=active]:opacity-100 transition-opacity" />
                  ) : (
                    <SparkleIcon
                      className={`w-4 h-4 text-slate-500 opacity-100 data-[state=active]:opacity-0 transition-opacity
                    `}
                    />
                  )}

                  {tab.name}
                </code>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            key={"results"}
            value="results"
            className="flex justify-center"
          >
            <div>
              <h1>results</h1>
              <AnswerMarkdown markdown={agentState?.answer?.markdown} />
            </div>
          </TabsContent>
          <TabsContent value="sources" className="flex justify-center">
            <div>
              <h1>sources</h1>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
