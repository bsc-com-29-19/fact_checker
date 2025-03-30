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

  return (
    <div className="">
      <Select
        value={agent}
        onValueChange={(v: "fact-check" | "youtube") => setAgent(v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fact-check">Fact Check Agent</SelectItem>
          <SelectItem value="youtube">YouTube Agent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
