// contexts/ModelContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type Model = "gemini-2.0-flash" | "youtube";

const ModelContext = createContext<{
  model: Model;
  setModel: (model: Model) => void;
}>({
  model: "gemini-2.0-flash",
  setModel: () => {},
});

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<Model>("gemini-2.0-flash");

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  return useContext(ModelContext);
}

