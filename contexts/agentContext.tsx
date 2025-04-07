// contexts/AgentContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type Agent = "fact_checker_agent" | "youtube";

const AgentContext = createContext<{
  agent: Agent;
  setAgent: (agent: Agent) => void;
}>({
  agent: "fact_checker_agent",
  setAgent: () => {},
});

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent>("fact_checker_agent");

  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  return useContext(AgentContext);
}
