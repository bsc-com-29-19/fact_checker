//CustomWindow.tsx
"use client";

import {
  WindowProps,
  useChatContext,
} from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
export default function CustomWindow({ children }: WindowProps) {
  const { open, setOpen } = useChatContext();

  if (!open) return null;

  return (
    <div
      className=" fixed right-0 top-0 h-full w-1/3 "
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}


