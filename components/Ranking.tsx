//Ranking.tsx
import React from "react";

const sources = [
  { name: "BBC News", truthPercentage: 92 },
  { name: "FactCheck", truthPercentage: 87 },
  { name: "Random Blog", truthPercentage: 43 },
  { name: "Unknown Websites", truthPercentage: 27 },
];

const getColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

const Ranking = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Truthfulness Ranking
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {sources
          .sort((a, b) => b.truthPercentage - a.truthPercentage) // Sort highest first
          .map((source, index) => (
            <div key={index} className="relative flex items-center">
              {/* Circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold ${getColor(
                  source.truthPercentage
                )}`}
              >
                {source.truthPercentage}%
              </div>
              {/* Source Name */}
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                {source.name}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Ranking;
