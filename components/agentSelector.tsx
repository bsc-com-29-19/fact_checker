

// AgentSelector.tsx
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
import { Bot } from "lucide-react"; // Import a suitable icon

// Define a type for agent values for better type safety
type AgentType = "fact_checker_agent" | "youtube";

export function AgentSelector() {
  const { agent, setAgent } = useAgent();

  return (
    <div className="">
      <Select
        value={agent}
        onValueChange={(v: string) => setAgent(v as AgentType)}
      >
        <SelectTrigger
          // Responsive width: auto on mobile, 180px on medium screens and up
          className="w-auto md:w-[230px] dark:bg-transparent flex items-center gap-2"
          data-tooltip-id="agent-tooltip" // Unique ID for the tooltip
          data-tooltip-content="Select an agent"
          data-tooltip-place="top"
        >
          <Bot size={16} /> {/* Icon is always visible */}
          {/* Text is hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:block">
            <SelectValue placeholder="Select agent" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fact_checker_agent">Fact Check Agent</SelectItem>
          <SelectItem value="youtube">YouTube Agent</SelectItem>
        </SelectContent>
        <Tooltip id="agent-tooltip" />
      </Select>
    </div>
  );
}
