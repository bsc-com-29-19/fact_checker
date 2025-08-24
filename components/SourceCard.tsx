// components/SourceCard.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date-formatter";

// Define the shape of a reference for type safety
interface Reference {
  title: string;
  url: string;
  score?: number;
}

interface SourceCardProps {
  reference: Reference;
  index: number;
}

// A helper function to get styles for credibility/bias tags
const getTagStyles = (type: "credibility" | "bias", value: string) => {
  if (type === "credibility") {
    switch (value) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  }
  if (type === "bias") {
    switch (value) {
      case "Low":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-pink-100 text-pink-800";
    }
  }
  return "bg-gray-100 text-gray-800";
};

export function SourceCard({ reference, index }: SourceCardProps) {
  const safeScore = reference?.score ?? 0;
  const today = new Date();

  const credibility =
    safeScore >= 75 ? "High" : safeScore >= 50 ? "Medium" : "Low";
  const bias = safeScore >= 75 ? "Low" : safeScore >= 25 ? "Medium" : "High";

  return (
    <Card
      key={index}
      className="group hover:border-[#6766FC]/30 dark:border-transparent transition-colors hover:bg-[#6766FC]/5 dark:hover:bg-[#303030]"
    >
      {/* --- THIS IS THE KEY RESPONSIVE CHANGE --- */}
      {/* Stacks vertically on mobile, becomes a row on small screens and up */}
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4">
        {/* Left Side: Title, URL, Date */}
        <div className="space-y-2 flex-1 w-full">
          <CardTitle className="text-base font-semibold">
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black dark:text-white hover:text-[#6766FC] transition-colors"
            >
              {reference.title || `Reference ${index + 1}`}
            </a>
          </CardTitle>
          <div className="text-sm">
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-white/80 hover:text-[#6766FC] break-all transition-colors"
            >
              {reference.url}
            </a>
          </div>
          <div className="text-sm text-gray-500 pt-1">
            <span>{formatDate(today)}</span>
          </div>
        </div>

        {/* Right Side: Metrics (Score, Credibility, Bias) */}
        {/* Aligns left on mobile, right on desktop */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:space-y-2 w-full sm:w-auto">
          {reference.score !== undefined && (
            <div className="text-right flex items-center gap-2">
              <div className="text-sm text-gray-500 dark:text-white/50">
                Score:
              </div>
              <div className="text-black dark:text-white font-medium">
                {reference.score}
              </div>
            </div>
          )}
          <div
            className={`text-xs px-2 py-1 rounded-md font-bold ${getTagStyles(
              "credibility",
              credibility
            )}`}
          >
            Credibility: {credibility}
          </div>
          <div
            className={`text-xs px-2 py-1 rounded-md font-bold ${getTagStyles(
              "bias",
              bias
            )}`}
          >
            Bias: {bias}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
