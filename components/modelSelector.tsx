// modelSelector.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModel } from "@/contexts/modelContext";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { BrainCircuit } from "lucide-react"; // Import a suitable icon

// Define a type for model values for better readability
type ModelType =
  | "gpt-3.5-turbo"
  | "llama3.5"
  | "gpt-4o"
  | "claude-3-sonnet-20240229"
  | "deepseek-r1:latest"
  | "gemini-2.0-flash"
  | "gemini-2.5-flash-preview-04-17";

export function ModelSelector() {
  const { model, setModel } = useModel();

  return (
    <div>
      <Select
        value={model}
        onValueChange={(v: string) => setModel(v as ModelType)}
      >
        <SelectTrigger
          // REMOVED the 'hidden' class and added responsive classes
          className="w-auto md:w-[180px] dark:bg-transparent flex items-center gap-2"
          data-tooltip-id="model-tooltip" // Unique ID for the tooltip
          data-tooltip-content="Select a model"
          data-tooltip-place="top"
        >
          <BrainCircuit size={16} /> {/* Icon is always visible */}
          {/* Text is hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:block">
            <SelectValue placeholder="Select model" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          <SelectItem value="llama3.5">Llama 3.5</SelectItem>
          <SelectItem value="gpt-4o">gpt-4o</SelectItem>
          <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
          <SelectItem value="gemini-2.5-flash-preview-04-17">
            Gemini 2.5 Pro
          </SelectItem>
          <SelectItem value="claude-3-sonnet-20240229">
            Claude 3 Sonnet
          </SelectItem>
          <SelectItem value="deepseek-r1:latest">DeepSeek R1</SelectItem>
        </SelectContent>
        <Tooltip id="model-tooltip" />
      </Select>
    </div>
  );
}
