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
      <ul>
        {sources
          .sort((a, b) => b.truthPercentage - a.truthPercentage) // Sort highest first
          .map((source, index) => (
            <li key={index} className="mb-2">
              <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                <span>{source.name}</span>
                <span>{source.truthPercentage}%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full">
                <div 
                  className={`${getColor(source.truthPercentage)} h-2 rounded-full`}
                  style={{ width: `${source.truthPercentage}%` }}
                ></div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Ranking;
