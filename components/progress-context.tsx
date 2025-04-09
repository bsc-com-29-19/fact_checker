// Create this in a new file or at the top of CustomWindow.tsx
import { createContext, useContext } from "react";

export const ProgressContext = createContext<any>(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
