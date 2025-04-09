"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModel } from "@/contexts/modelContext";

export function ModelSelector() {
  const { model, setModel } = useModel();

  const handleValueChange = useCallback(
    (
      value:
        | "gpt-3.5-turbo"
        | "llama3.5"
        | "gpt-4o"
        | "claude-3-sonnet-20240229"
        | "deepseek-r1:latest"
    ) => {
      // Prevent default behavior just in case
      if (typeof window !== "undefined") {
        window.__isModelSelecting = true;
      }

      setModel(value);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.__isModelSelecting = false;
        }
      }, 100);
    },
    [setModel]
  );

  return (
    <div
      onClick={(e) => e.preventDefault()} // Additional safeguard
      onKeyDown={(e) => e.preventDefault()} // Additional safeguard
    >
      <Select value={model} onValueChange={handleValueChange}>
        <SelectTrigger
          className="w-[180px]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="gpt-3.5-turbo"
            onSelect={(e) => e.preventDefault()}
          >
            GPT-3.5 Turbo
          </SelectItem>
          <SelectItem value="llama3.5" onSelect={(e) => e.preventDefault()}>
            Llama 3.5
          </SelectItem>
          <SelectItem value="gpt-4o" onSelect={(e) => e.preventDefault()}>
            GPT-4o
          </SelectItem>
          <SelectItem
            value="claude-3-sonnet-20240229"
            onSelect={(e) => e.preventDefault()}
          >
            Claude 3 Sonnet
          </SelectItem>
          <SelectItem
            value="deepseek-r1:latest"
            onSelect={(e) => e.preventDefault()}
          >
            DeepSeek R1
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
