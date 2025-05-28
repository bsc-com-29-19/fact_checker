// contexts/ModelContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define your available models
export type Model =
  | "gpt-3.5-turbo"
  | "llama3.5"
  | "gpt-4o"
  | "claude-3-sonnet-20240229"
  | "deepseek-r1:latest"
  | "gemini-2.0-flash"
  | "gemini-2.5-flash-preview-04-17"; // Add any other models you want to support;

type ModelContextType = {
  model: string;
  setModel: (model: string) => void;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

// export function ModelProvider({ children }: { children: ReactNode }) {
//   const [model, setModel] = useState<Model>("gpt-3.5-turbo"); // Default model

// export function ModelProvider({ children }: { children: ReactNode }) {
//   const [model, setModel] = useState<Model>(String); // Default model

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const model =
    globalThis.window === undefined
      ? "gemini-2.0-flash"
      : new URL(window.location.href).searchParams.get("coAgentsModel") ??
        "gemini-2.0-flash";
  // const [hidden, setHidden] = useState<boolean>(false);

  const setModel = (model: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("coAgentsModel", model);
    window.location.href = url.toString();
  };

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
