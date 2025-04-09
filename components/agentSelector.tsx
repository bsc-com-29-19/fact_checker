//AgentSelector.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgent } from "@/contexts/agentContext";

export function AgentSelector() {
  const { agent, setAgent } = useAgent(); // Use the useAgent hook

  const handleValueChange = (value: "fact_checker_agent" | "youtube") => {
    setAgent(value);
  };

  return (
    <div className="">
      <Select value={agent} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fact_checker_agent">Fact Check Agent</SelectItem>
          <SelectItem value="youtube">YouTube Agent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
