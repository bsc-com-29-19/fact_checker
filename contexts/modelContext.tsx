// contexts/ModelContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define your available models
export type Model =
  | "gpt-3.5-turbo"
  | "llama3.5"
  | "claude-3-sonnet-20240229"
  | "deepseek-r1:latest";

type ModelContextType ={
  model: string;
  setModel: (model: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

// export function ModelProvider({ children }: { children: ReactNode }) {
//   const [model, setModel] = useState<Model>("gpt-3.5-turbo"); // Default model


  // export function ModelProvider({ children }: { children: ReactNode }) {
  //   const [model, setModel] = useState<Model>(String); // Default model
  


    export const ModelProvider = ({
      children,
    }: {
      children: ReactNode;
    }) => {
      const model =
        globalThis.window === undefined
          ? "openai"
          : new URL(window.location.href).searchParams.get("coAgentsModel") ??
            "openai";
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
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
