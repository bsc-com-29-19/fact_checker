'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResearchContext } from "@/lib/research-provider";
import { AnswerMarkdown } from "./AnswerMarkdown";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import { Progress } from "./progress";

export function TabbedInterface() {
  const { researchInput, setResearchInput, researchQuery, handleResearch } = useResearchContext();
  const MAX_INPUT_LENGTH = 500;
  const { state: agentState } = useCoAgent<AgentState>();

  const steps = agentState?.steps?.map((step: any) => ({
    description: step.description || "",
    status: step.status || "pending",
    updates: step.updates || [],
  })) || [];

  return (
    <Tabs defaultValue="answer" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="answer">Answer</TabsTrigger>
        <TabsTrigger value="source" disabled={!researchQuery}>
          Source
        </TabsTrigger>
      </TabsList>

      {/* Answer Tab */}
      <TabsContent value="answer" className="space-y-6 p-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center">
            What do you want to fact check?
          </h1>

          <div className="w-full bg-slate-100/50 border shadow-sm rounded-md transition-all border-gray-300">
            <textarea
              placeholder="Enter your claim here..."
              className="bg-transparent p-4 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 w-full min-h-[120px] text-lg"
              value={researchInput}
              onChange={(e) => setResearchInput(e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
            />
            
            <div className="grid grid-cols-3 gap-2 p-4 items-center">
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {researchInput.length} / {MAX_INPUT_LENGTH}
                </span>
              </div>
              
              <div className="col-span-1 flex justify-center">
                {/* ModelSelector would go here */}
              </div>
              
              <div className="col-span-1 flex justify-end">
                <button 
                  onClick={() => handleResearch(researchInput)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                  disabled={!researchInput.trim()}
                >
                  Check
                  <span className="w-4 h-4">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {researchQuery && (
          <div className="space-y-4">
            <Progress steps={steps} />
            {agentState?.answer?.markdown && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <AnswerMarkdown markdown={agentState.answer.markdown} />
              </div>
            )}
          </div>
        )}
      </TabsContent>

      {/* Source Tab */}
      <TabsContent value="source" className="p-4">
        {agentState?.answer?.references?.length ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">References</h2>
            <ul className="space-y-2">
              {agentState.answer.references.map((ref: any, idx: number) => (
                <li key={idx} className="border-b pb-2">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {idx + 1}. {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {researchQuery ? "No sources available" : "Perform a search first"}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}