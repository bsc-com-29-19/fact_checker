import React, { useState } from "react";

interface CustomInputProps {
  inProgress: boolean;
  onSend: (text: string) => void;
  isVisible: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({ inProgress, onSend, isVisible }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center border p-2 rounded-md w-full max-w-md bg-white shadow-md">
      <input
        type="text"
        className="flex-1 p-2 border-none outline-none"
        placeholder="Enter text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={inProgress}
      />
      <button
        className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-md"
        onClick={handleSubmit}
        disabled={inProgress}
      >
        Send
      </button>
    </div>
  );
};
