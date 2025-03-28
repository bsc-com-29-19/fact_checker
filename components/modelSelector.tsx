// components/ModelSelector.tsx
"use client";

import { Model, useModel } from "@/contexts/modelContext";
import { ChevronDown } from "lucide-react";

export function ModelSelector() {
  const { model, setModel } = useModel();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
        {model.split(":")[0]} {/* Show simplified name */}
        <ChevronDown size={16} />
      </button>

      <div className="absolute right-0 z-10 hidden w-48 mt-1 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 group-hover:block">
        <div className="py-1">
          <ModelOption
            model="gpt-3.5-turbo"
            current={model}
            setModel={setModel}
            display="GPT-3.5 Turbo"
          />
          <ModelOption
            model="llama3.5"
            current={model}
            setModel={setModel}
            display="Llama 3.5"
          />
          <ModelOption
            model="claude-3-sonnet-20240229"
            current={model}
            setModel={setModel}
            display="Claude 3 Sonnet"
          />
          <ModelOption
            model="deepseek-r1:latest"
            current={model}
            setModel={setModel}
            display="DeepSeek R1"
          />
        </div>
      </div>
    </div>
  );
}

function ModelOption({
  model,
  current,
  setModel,
  display,
}: {
  model: Model;
  current: string;
  setModel: (model: Model) => void;
  display: string;
}) {
  return (
    <button
      onClick={() => setModel(model)}
      className={`block w-full px-4 py-2 text-left text-sm ${
        current === model
          ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {display}
    </button>
  );
}
