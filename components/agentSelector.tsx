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
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

export function AgentSelector() {
  const { agent, setAgent } = useAgent(); // Use the useAgent hook

  return (
    <div className="">
      <Select
        value={agent}
        onValueChange={(v: "fact_checker_agent" | "youtube") => setAgent(v)}
      >
        <SelectTrigger
          className="w-[180px] dark:bg-transparent"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Select an agent"
          data-tooltip-place="top"
        >
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fact_checker_agent">Fact Check Agent</SelectItem>
          <SelectItem value="youtube">YouTube Agent</SelectItem>
        </SelectContent>
        <Tooltip id="my-tooltip" />
      </Select>
    </div>
  );
}
