// ResearchWrapper.tsx

import { AnimatePresence } from "framer-motion";
import { useResearchContext } from "@/lib/research-provider";
import HomeView from "./HomeView";
import { ResultsView } from "./ResultsView";
import { CopilotSidebar } from "@copilotkit/react-ui";
import SideHeader from "./chatsidebarcomponents/SideHeader";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query"; // 1. Import the new hook

export function ResearchWrapper() {
  const { researchQuery, setResearchInput } = useResearchContext();

  // 2. Use the hook to check if we're on a "desktop" screen size.
  // 'md' is typically 768px.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex w-full h-full">
      {/* The main content pane no longer needs any complex layout classes */}
      <main className="flex-1">
        <div className="w-full max-w-4xl mx-auto p-4">
          {researchQuery ? (
            <AnimatePresence /* ... */>
              <ResultsView key="results" />
            </AnimatePresence>
          ) : (
            <AnimatePresence /* ... */>
              <HomeView key="home" />
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* --- THIS IS THE CRITICAL CHANGE --- */}
      {/* 3. Conditionally render the entire sidebar based on the screen size. */}
      {/* If isDesktop is false, this ENTIRE block (and the overlay) will not exist. */}
      {isDesktop && (
        <aside className="md:w-64 lg:w-80 xl:w-96 p-4 border-l">
          <div className="w-full h-full flex flex-col">
            <CopilotSidebar
              className="w-full h-full flex flex-col"
              Header={SideHeader}
              defaultOpen={true}
              clickOutsideToClose={false}
              Input={() => null}
              RenderResultMessage={() => null}
            />
          </div>
        </aside>
      )}

      {/* The footer is also REMOVED from here, as it's handled by the parent */}
    </div>
  );
}
