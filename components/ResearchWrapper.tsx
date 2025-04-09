import { AnimatePresence } from "framer-motion";
import { useResearchContext } from "@/lib/research-provider";
import HomeView from "./HomeView";
import { ResultsView } from "./ResultsView";
import { ViewContainer } from "./ViewContainer";

export function ResearchWrapper() {
  const { researchQuery, setResearchInput } = useResearchContext();

  return (
    <div className="flex flex-col min-h-screen relative z-10">
      {/* Main content area - column on mobile, row on desktop */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        {/* Left panel (dynamic content) - full width on mobile */}
        <div className="w-full lg:flex-1 lg:overflow-hidden">
          {researchQuery ? (
            <AnimatePresence
              key="results"
              onExitComplete={() => {
                setResearchInput("");
              }}
              mode="wait"
            >
              <ResultsView key="results" />
            </AnimatePresence>
          ) : (
            <AnimatePresence key="home" mode="wait">
              <HomeView key="home" />
            </AnimatePresence>
          )}
        </div>

        {/* Right panel (fixed ViewContainer) - full width on mobile, fixed on desktop */}
        <div className="w-full lg:w-96 flex-shrink-0 lg:ml-4">
          <ViewContainer />
        </div>
      </div>

      {/* Footer - centered and always at bottom */}
      <footer className="text-xs p-2 text-center w-full">
        <a
          href="https://copilotkit.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 font-medium hover:underline"
        >
          Powered by Group 10 ICT project 🪁
        </a>
      </footer>
    </div>
  );
}
