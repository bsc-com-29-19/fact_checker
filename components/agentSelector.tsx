// components/AgentSelector.tsx
"use client";
import { useAgent } from "@/contexts/agentContext";

export function AgentSelector() {
  const { agent, setAgent } = useAgent();

  return (
    <select
      value={agent}
      onChange={(e) => setAgent(e.target.value as Agent)}
      className="p-2 rounded border"
    >
      <option value="fact-check">Fact Check Agent</option>
      <option value="youtube">YouTube Agent</option>
    </select>
  );
}
