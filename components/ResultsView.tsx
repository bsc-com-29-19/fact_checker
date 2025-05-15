// // //ResultsView.tsx
// // "use client";

// // import { useResearchContext } from "@/lib/research-provider";
// // import { motion } from "framer-motion";
// // import { BookOpenIcon, LoaderCircleIcon, SparkleIcon } from "lucide-react";
// // // import { SkeletonLoader } from "./SkeletonLoader";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
// // // import { Progress } from "./Progress";
// // import { AnswerMarkdown } from "./AnswerMarkdown";
// // import { useModel } from "@/contexts/modelContext";
// // import { useAgent } from "@/contexts/agentContext";
// // import { AgentState } from "@/lib/types";
// // import { useState } from "react";
// // import { Progress1 } from "./progress1";

// // export function ResultsView() {
// //   const { researchQuery } = useResearchContext();
// //   const { model } = useModel();
// //   const { agent } = useAgent();
// //   //agent state
// //   const { state: agentState } = useCoAgent<AgentState>({
// //     name: agent,
// //     initialState: {
// //       model,
// //     },
// //   });

// //   //keeps track of the current agent processing state
// //   const steps =
// //     agentState?.steps?.map((step: any) => {
// //       return {
// //         description: step.description || "",
// //         status: step.status || "pending",
// //         updates: step.updates || [],
// //       };
// //     }) || [];

// //   // Handle progress rendering with co-agent state
// //   useCoAgentStateRender<AgentState>(
// //     {
// //       name: agent,
// //       // render: ({ state }) => {
// //       //   if (state.steps?.length > 0) {
// //       //     const steps = state.steps.map((step) => ({
// //       //       description: step.message,
// //       //       status: step.done ? "complete" : "pending",
// //       //       updates: [],
// //       //     }));
// //       //     return <Progress steps={steps} />;
// //       //   }
// //       //   return null;
// //       // },
// //       render: () => {
// //         return <Progress1 steps={steps} />;
// //       },
// //     },
// //     [agentState]
// //   );

// //   console.log("AGENT_STATE", agentState);

// //   const tabs: { name: string; value: string }[] = [
// //     {
// //       name: "Results",
// //       value: "results",
// //     },
// //     {
// //       name: "Sources",
// //       value: "sources",
// //     },
// //   ];

// //   const isLoading = !agentState?.answer?.markdown;

// //   console.log("is loading :", isLoading);

// //   const [activeTab, setActiveTab] = useState(tabs[0].value);

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: -50 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       exit={{ opacity: 0, y: -50 }}
// //       transition={{ duration: 0.5, ease: "easeOut" }}
// //     >
// //       {/* <div className="max-w-[1000px] p-8 lg:p-4 flex flex-col gap-y-8 mt-4 lg:mt-6 text-sm lg:text-base">
// //         <div className="space-y-4">
// //           <h1 className="text-3xl lg:text-4xl font-extralight">
// //             {researchQuery}
// //           </h1>
// //         </div>

// //         <Progress steps={steps} />

// //         <div className="grid grid-cols-12 gap-8">
// //           <div className="col-span-12 lg:col-span-8 flex flex-col">
// //             <h2 className="flex items-center gap-x-2">
// //               {isLoading ? (
// //                 <LoaderCircleIcon className="animate-spin w-4 h-4 text-slate-500" />
// //               ) : (
// //                 <SparkleIcon className="w-4 h-4 text-slate-500" />
// //               )}
// //               Answer
// //             </h2>

// //             <div className="text-slate-500 font-light">
// //               {isLoading ? (
// //                 // (
// //                 //     <SkeletonLoader />
// //                 // )
// //                 "Loading...."
// //               ) : (
// //                 <AnswerMarkdown markdown={agentState?.answer?.markdown} /> // displays search results
// //               )}
// //             </div>
// //           </div>

// //           {agentState?.answer?.references?.length && (
// //             <div className="flex col-span-12 lg:col-span-4 flex-col gap-y-4 w-[200px]">
// //               <h2 className="flex items-center gap-x-2">
// //                 <BookOpenIcon className="w-4 h-4 text-slate-500" />
// //                 References
// //               </h2>
// //               <ul className="text-slate-900 font-light text-sm flex flex-col gap-y-2">
// //                 {agentState?.answer?.references?.map(
// //                   (ref: any, idx: number) => (
// //                     <li key={idx}>
// //                       <a
// //                         href={ref.url}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                       >
// //                         {idx + 1}. {ref.title}
// //                       </a>
// //                     </li>
// //                   )
// //                 )}
// //               </ul>
// //             </div>
// //           )}
// //         </div>
// //       </div> */}
// //       <div className="w-full flex-col my-8 h-full">
// //         <div className="space-y-4 flex justify-center">
// //           <h1 className="text-3xl lg:text-4xl font-extralight mb-4">
// //             {researchQuery}
// //           </h1>
// //         </div>
// //         <Tabs
// //           // defaultValue={tabs[0].value}
// //           // defaultValue={}
// //           value={activeTab}
// //           onValueChange={setActiveTab}
// //           className="max-w-xs w-full flex-col mx-auto  mt-2"
// //         >
// //           <TabsList className="w-full p-0 bg-background  flex justify-center border-b rounded-none">
// //             {tabs.map((tab) => (
// //               <TabsTrigger
// //                 key={tab.value}
// //                 value={tab.value}
// //                 className="rounded-none flex bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#6766FC] mb-4"
// //               >
// //                 <code className="text-[20px] flex gap-4">
// //                   {isLoading && activeTab === tab.value ? (
// //                     <LoaderCircleIcon className="animate-spin w-4 h-4 text-[#6766FC] data-[state=active]:opacity-100 transition-opacity" />
// //                   ) : (
// //                     <SparkleIcon
// //                       className={`w-4 h-4 text-slate-500 opacity-100 data-[state=active]:opacity-0 transition-opacity
// //                     `}
// //                     />
// //                   )}

// //                   {tab.name}
// //                 </code>
// //               </TabsTrigger>
// //             ))}
// //           </TabsList>

// //           <TabsContent
// //             key={"results"}
// //             value="results"
// //             className="flex justify-center"
// //           >
// //             <div>
// //               <h1>results</h1>
// //               <AnswerMarkdown markdown={agentState?.answer?.markdown} />
// //             </div>
// //           </TabsContent>
// //           <TabsContent value="sources" className="flex justify-center">
// //             <div>
// //               <h1>sources</h1>
// //             </div>
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     </motion.div>
// //   );
// // }
// "use client";

// import { useResearchContext } from "@/lib/research-provider";
// import { motion } from "framer-motion";
// import { LoaderCircleIcon, SparkleIcon } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
// import { useModel } from "@/contexts/modelContext";
// import { useAgent } from "@/contexts/agentContext";
// import { AgentState } from "@/lib/types";
// import { useState, useEffect } from "react";
// import { Progress1 } from "./progress1";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// interface Reference {
//   title: string;
//   url: string;
// }

// export function ResultsView() {
//   const { researchQuery } = useResearchContext();
//   const { model } = useModel();
//   const { agent } = useAgent();

//   const [activeTab, setActiveTab] = useState("results");
//   const [parsedResults, setParsedResults] = useState({
//     trueStatement: "",
//     falseStatement: "",
//     wholeTruth: "",
//     references: [] as Reference[],
//   });

//   const { state: agentState } = useCoAgent<AgentState>({
//     name: agent,
//     initialState: { model },
//   });

//   useEffect(() => {
//     if (agentState?.answer?.markdown) {
//       const markdown = agentState.answer.markdown;

//       const lines = markdown.split("\n").map((line) => line.trim());

//       let trueStatement = "";
//       let falseStatement = "";
//       let wholeTruth = "";
//       const references: Reference[] = [];

//       let currentSection: string | null = null;

//       for (const line of lines) {
//         if (line.toLowerCase().startsWith("true:")) {
//           currentSection = "true";
//           trueStatement = line.substring("true:".length).trim();
//         } else if (line.toLowerCase().startsWith("false:")) {
//           currentSection = "false";
//           falseStatement = line.substring("false:".length).trim();
//         } else if (line.toLowerCase().startsWith("whole truth:")) {
//           currentSection = "wholeTruth";
//           wholeTruth = line.substring("whole truth:".length).trim();
//         } else if (/^\[\d+\]:/.test(line)) {
//           currentSection = "references";
//           const match = line.match(
//             /^\[\d+\]:\s+(https?:\/\/[^\s]+)\s+"([^"]+)"/
//           );
//           if (match) {
//             const url = match[1];
//             const title = match[2];
//             references.push({ url, title });
//           }
//         } else {
//           if (currentSection === "true" && line) {
//             trueStatement += (trueStatement ? "\n" : "") + line;
//           } else if (currentSection === "false" && line) {
//             falseStatement += (falseStatement ? "\n" : "") + line;
//           } else if (currentSection === "wholeTruth" && line) {
//             wholeTruth += (wholeTruth ? "\n" : "") + line;
//           }
//         }
//       }

//       setParsedResults({
//         trueStatement,
//         falseStatement,
//         wholeTruth,
//         references,
//       });
//     }
//   }, [agentState?.answer?.markdown]);

//   const steps =
//     agentState?.steps?.map((step: any) => ({
//       description: step.description || "",
//       status: step.status || "pending",
//       updates: step.updates || [],
//     })) || [];

//   useCoAgentStateRender<AgentState>(
//     { name: agent, render: () => <Progress1 steps={steps} /> },
//     [agentState]
//   );

//   const isLoading = !agentState?.answer?.markdown;

//   const tabs = [
//     { name: "Results", value: "results" },
//     { name: "Sources", value: "sources" },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -50 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//     >
//       <div className="w-full flex-col my-8 h-full">
//         <div className="space-y-4 flex justify-center">
//           <div className="flex justify-center items-center gap-4 mb-4">
//             <h1 className="text-2xl lg:text-3xl font-normal"> Claim : </h1>
//             <h1 className="text-2xl lg:text-3xl font-extralight  items-center">
//               {researchQuery}
//             </h1>
//           </div>
//         </div>

//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="w-full max-w-4xl mx-auto"
//         >
//           <TabsList className="w-full p-0 bg-background flex justify-center border-b rounded-none">
//             {tabs.map((tab) => (
//               <TabsTrigger
//                 key={tab.value}
//                 value={tab.value}
//                 className="rounded-none flex bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#6766FC] mb-4"
//               >
//                 <code className="text-[20px] flex gap-4">
//                   {isLoading && activeTab === tab.value ? (
//                     <LoaderCircleIcon className="animate-spin w-4 h-4 text-[#6766FC]" />
//                   ) : (
//                     <SparkleIcon className="w-4 h-4 text-slate-500" />
//                   )}
//                   {tab.name}
//                 </code>
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           <TabsContent value="results" className="mt-6">
//             <div className="space-y-6">
//               {isLoading ? (
//                 <div className="text-center py-8">Loading results...</div>
//               ) : (
//                 <>
//                   <h1 className="font-bold text-3xl">
//                     {`User's Claim Decomposition`}
//                   </h1>
//                   <Card className="border-green-200 bg-green-50">
//                     <CardHeader>
//                       <CardTitle className="text-green-700">
//                         True Statement
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="prose max-w-none">
//                         {parsedResults.trueStatement ||
//                           "No true statements found"}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-red-200 bg-red-50">
//                     <CardHeader>
//                       <CardTitle className="text-red-700">
//                         False Statement
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="prose max-w-none">
//                         {parsedResults.falseStatement ||
//                           "No false statements found"}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-blue-200 bg-blue-50">
//                     <CardHeader>
//                       <CardTitle className="text-blue-700">
//                         Whole Truth
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="prose max-w-none">
//                         {parsedResults.wholeTruth ||
//                           "No overall assessment available"}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="sources" className="mt-6">
//             {isLoading ? (
//               <div className="text-center py-8">Loading sources...</div>
//             ) : (
//               <div className="space-y-4">
//                 {parsedResults.references.length ? (
//                   parsedResults.references.map((reference, index) => (
//                     <Card key={index}>
//                       <CardHeader>
//                         <CardTitle className="text-sm font-medium">
//                           <a
//                             href={reference.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="hover:underline text-blue-600"
//                           >
//                             {reference.title || `Reference ${index + 1}`}
//                           </a>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="text-sm text-gray-600">
//                           <a
//                             href={reference.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500 hover:underline break-all"
//                           >
//                             {reference.url}
//                           </a>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <div className="text-center py-8">No sources available</div>
//                 )}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </motion.div>
//   );
// }


// ResultsView.tsx
"use client";

import { useResearchContext } from "@/lib/research-provider";
import { motion } from "framer-motion";
import { LoaderCircleIcon, SparkleIcon, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";
import { AgentState } from "@/lib/types";
import { useState, useEffect } from "react";
import { Progress1 } from "./progress1";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Reference {
  title: string;
  url: string;
  score?: number;
}

export function ResultsView() {
  const { researchQuery, setResearchQuery } = useResearchContext();
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
      const references: Reference[] = (agentState?.ranked_sources || []).map(
        (source: any) => ({
          title: source.title,
          url: source.url,
          score: source.score || 0,
        })
      );
      console.log(agentState.ranked_sources);
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
      <div className="w-full flex-col my-4 h-full">
        <div className="space-y-4 flex justify-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-2xl lg:text-3xl font-normal">Claim:</h1>
            <h1 className="text-2xl lg:text-3xl font-extralight items-center">
              {researchQuery}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResearchQuery("")}
              className="ml-4"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
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
                        className="group hover:border-[#6766FC]/30 transition-colors"
                      >
                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                          <div className="space-y-2 flex-1">
                            <CardTitle className="text-base font-semibold">
                              <a
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-[#6766FC] transition-colors"
                              >
                                {reference.title || `Reference ${index + 1}`}
                              </a>
                            </CardTitle>
                            <div className="text-sm">
                              <a
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-[#6766FC] break-all transition-colors"
                              >
                                {reference.url}
                              </a>
                            </div>
                          </div>

                          {/* Right-aligned metrics column */}
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            {reference.score !== undefined && (
                              <div className="text-right flex items-center gap-2">
                                <div className="text-md text-gray-500">
                                  Score :
                                </div>
                                <div className="text-black font-medium">
                                  {reference.score}
                                </div>
                              </div>
                            )}
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                credibility === "High"
                                  ? "bg-green-100 text-green-800"
                                  : credibility === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Credibility: {credibility}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                bias === "Low"
                                  ? "bg-blue-100 text-blue-800"
                                  : bias === "Medium"
                                  ? "bg-purple-100 text-yellow-800"
                                  : "bg-pink-100 text-pink-800"
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