// //AgentState.tsx
// "use client"; // only necessary if you are using Next.js with the App Router.

// import { useCoAgentStateRender } from "@copilotkit/react-core";
// // import {Progress}  from "@/components/agentState";

// type AgentState = {
//   logs: string[];
// };

// useCoAgentStateRender<AgentState>({
//   name: "basic_agent",
//   render: ({ state, nodeName, status }) => {
//     if (!state.logs || state.logs.length === 0) {
//       return null;
//     }

//     // Progress is a component we are omitting from this example for brevity.
//     // return <Progress logs={state.logs} />;
//   },
// });
