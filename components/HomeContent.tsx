// 'use client';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useResearchContext } from "@/lib/research-provider";
// import { motion } from "framer-motion";
// import { Textarea } from "@/components/ui/textArea";
// import { ModelSelector } from "@/components/modelSelector";
// import { AgentSelector } from "@/components/agentSelector";
// import Button from "@/components/Button";
// import { CornerDownLeft } from "lucide-react";
// import { AnswerMarkdown } from "@/components/AnswerMarkdown";

// export default function HomeContent() {
//   const { researchInput, setResearchInput, researchQuery, handleResearch, researchResult } = useResearchContext();
//   const MAX_INPUT_LENGTH = 500;

//   return (
//     <div className="flex-1 container max-w-4xl py-8">
//       <Tabs defaultValue="answer" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="answer">Answer</TabsTrigger>
//           <TabsTrigger value="source" disabled={!researchQuery}>
//             Sources
//           </TabsTrigger>
//         </TabsList>

//         {/* Answer Tab */}
//         <TabsContent value="answer" className="space-y-8">
//           {!researchQuery ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-8"
//             >
//               <div className="text-center space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tight">What Do You Want To Fact Check?</h1>
//               </div>

//               <div className="space-y-4">
//                 <Textarea
//                   placeholder="Enter a claim to fact-check..."
//                   className="min-h-[120px] text-lg"
//                   value={researchInput}
//                   onChange={(e) => setResearchInput(e.target.value)}
//                   maxLength={MAX_INPUT_LENGTH}
//                 />
                
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-muted-foreground">
//                     {researchInput.length}/{MAX_INPUT_LENGTH}
//                   </div>
                  
//                   <Button 
//                     onClick={() => handleResearch(researchInput)}
//                     className="gap-2 flex items-center"
//                     disabled={!researchInput.trim()}
//                   >
//                     Check
//                     <CornerDownLeft className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-center gap-4">
//                 <AgentSelector />
//                 <ModelSelector />
//               </div>
//             </motion.div>
//           ) : (
//             <div className="space-y-8">
//               <div className="space-y-2">
//                 <h2 className="text-2xl font-semibold">Claim:</h2>
//                 <p className="text-lg">{researchQuery}</p>
//               </div>

//               {researchResult?.answer && (
//                 <div className="space-y-2">
//                   <h2 className="text-2xl font-semibold">Answer:</h2>
//                   <AnswerMarkdown markdown={researchResult.answer} />
//                 </div>
//               )}
//             </div>
//           )}
//         </TabsContent>

//         {/* Sources Tab */}
//         <TabsContent value="source" className="space-y-4">
//           {researchResult?.sources && researchResult.sources.length > 0 ? (
//             <>
//               <h2 className="text-2xl font-semibold">Sources</h2>
//               <div className="space-y-4">
//                 {researchResult.sources.map((source, index) => (
//                   <div key={index} className="border rounded-lg p-4">
//                     <div className="flex justify-between items-start">
//                       <h3 className="font-medium">{source.title}</h3>
//                       {source.url && (
//                         <a 
//                           href={source.url} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="text-sm text-blue-500 hover:underline"
//                         >
//                           Visit Source
//                         </a>
//                       )}
//                     </div>
//                     {source.content && (
//                       <p className="mt-2 text-sm text-muted-foreground">
//                         {source.content}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-8 text-muted-foreground">
//               No sources available. Perform a search first.
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }