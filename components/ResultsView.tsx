//ResultsView.tsx
"use client";

import { useResearchContext } from "@/lib/research-provider";
import { motion } from "framer-motion";
import { BookOpenIcon, LoaderCircleIcon, SparkleIcon } from "lucide-react";
import { AnswerMarkdown } from "./AnswerMarkdown";
import { useCoAgent } from "@copilotkit/react-core";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";
import { AgentState } from "@/lib/types";
import { readEnv } from "openai/core.mjs";

export function ResultsView() {
  const { researchQuery } = useResearchContext();
  const { model } = useModel();
  const { agent } = useAgent();

  const { state: agentState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
    },
  });

  const isLoading = !agentState?.answer?.markdown;

  return (
    <div className="p-4 flex flex-col gap-y-8">
      {researchQuery}
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
              "Loading...."
            ) : (
              <AnswerMarkdown markdown={agentState?.answer?.markdown} />
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
              {agentState?.answer?.references?.map((ref: any, idx: number) => (
                <li key={idx}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    {idx + 1}. {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
