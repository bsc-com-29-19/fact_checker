//ResearchWrapper.tsx
import { AnimatePresence } from "framer-motion";
import { useResearchContext } from "@/lib/research-provider";
import HomeView from "./HomeView";
import { ResultsView } from "./ResultsView";
import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
import SideHeader from "./chatsidebarcomponents/SideHeader";
import Link from "next/link";
// import SideWindow from "./chatsidebarcomponents/SideWindow";
export function ResearchWrapper() {
  const { researchQuery, setResearchInput } = useResearchContext();

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex-1">
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
          <div className="hidden md:flex md:w-64 lg:w-80 xl:w-96 p-4 border-l">
            {/* <CopilotChat /> */}

            <div
              className="h-[80vh] w-full"
              style={
                {
                  "--copilot-kit-background-color": "#E0E9FD",
                  "--copilot-kit-secondary-color": "#6766FC",
                  "--copilot-kit-separator-color": "#b8b8b8",
                  "--copilot-kit-primary-color": "#FFFFFF",
                  "--copilot-kit-contrast-color": "#000000",
                  "--copilot-kit-secondary-contrast-color": "#000",
                } as React.CSSProperties
              }
            >
              <CopilotSidebar
                className="w-full h-full"
                Header={SideHeader}
                // Window={SideWindow}
                defaultOpen={true}
                clickOutsideToClose={false}
                Input={() => null}
              />
              {/* <CopilotChat
                labels={{
                  title: "Fact Checker steps",
                  initial: "fact checker steps",
                }}
                Input={() => null}
              /> */}
            </div>
            {/* <CopilotChat /> */}
          </div>
        </div>
        <footer className="text-xs flex mx-auto">
          <Link
            href="https://copilotkit.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 font-medium hover:underline mx-auto"
          >
            Powered by Fact Checker MW
          </Link>

          {/* <a
            href="https://copilotkit.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 font-medium hover:underline mx-auto"
          >
            Powered by Fact Checker MW
          </a> */}
        </footer>
      </div>
    </>
  );
}
