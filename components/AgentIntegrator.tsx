"use client";

import { useState, useEffect } from "react";

interface FactData {
  claim: string;
  trueStatement: string;
  falseStatement: string;
  wholeTruth: string;
}

interface AgentIntegratorProps {
  selectedModel: string | null;
}

const AgentIntegrator: React.FC<AgentIntegratorProps> = ({ selectedModel }) => {
  const [factData, setFactData] = useState<FactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedModel) return; // Don't fetch if no model is selected

    const fetchData = async () => {
      try {
        const response = await fetch(`https://your-backend.com/api/facts?model=${selectedModel}`); // Send selected model to backend
        if (!response.ok) throw new Error("Failed to fetch data");

        const data: FactData = await response.json();
        setFactData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedModel]); // Re-fetch when the model changes

  if (loading) return <p className="text-gray-500">Loading fact-check data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Fact Check Result</h2>
      <p><strong>Claim:</strong> {factData?.claim}</p>
      <p className="text-green-500"><strong>True Statement:</strong> {factData?.trueStatement}</p>
      <p className="text-red-500"><strong>False Statement:</strong> {factData?.falseStatement}</p>
      <p className="text-blue-500"><strong>Whole Truth:</strong> {factData?.wholeTruth}</p>
    </div>
  );
};

export default AgentIntegrator;
