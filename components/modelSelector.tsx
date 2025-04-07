//modelSelector.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModel } from "@/contexts/modelContext"; // Update the import path

export function ModelSelector() {
  const { model, setModel } = useModel(); // Use the useModel hook

  return (
    <div>
      <Select
        value={model}
        onValueChange={(
          v:
            | "gpt-3.5-turbo"
            | "llama3.5"
            | "gpt-4o"
            | "claude-3-sonnet-20240229"
            | "deepseek-r1:latest"
        ) => setModel(v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          <SelectItem value="llama3.5">Llama 3.5</SelectItem>
          <SelectItem value="claude-3-sonnet-20240229">
            Claude 3 Sonnet
          </SelectItem>
          <SelectItem value="deepseek-r1:latest">DeepSeek R1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
