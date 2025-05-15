import { AnimatePresence } from "framer-motion"; 
import { useResearchContext } from "@/lib/research-provider"; 
import HomeView from "./HomeView"; 
import { ResultsView } from "./ResultsView"; 
import { CopilotSidebar } from "@copilotkit/react-ui"; 
import SideHeader from "./chatsidebarcomponents/SideHeader"; 
import Link from "next/link"; 

export function ResearchWrapper() {
  
  const { researchQuery, setResearchInput } = useResearchContext(); 

  return (
    <>
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            {researchQuery && (
              <AnimatePresence
                key="results"
                onExitComplete={() => {
                  setResearchInput("");
                }}
                mode="wait"
              >
                <ResultsView key="results" />
              </AnimatePresence>
            )}
            <AnimatePresence key="home" mode="wait">
              <HomeView key="home" />
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex md:w-64 lg:w-80 xl:w-96 p-4 border-l">
          <div className="h-[calc(100vh-4rem)] w-full flex flex-col overflow-hidden">
            <CopilotSidebar
              className="w-full h-full flex flex-col"
              Header={SideHeader}
              defaultOpen={true}
              clickOutsideToClose={false}
              Input={() => null}
              RenderResultMessage={() => null}
            />
          </div>
        </div>
      </div>

      <footer className="text-xs flex mx-auto py-4">
        {" "}
        <Link
          href="https://copilotkit.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 font-medium hover:underline mx-auto"
        >
          Powered by Fact Checker MW
        </Link>
      </footer>
    </>
  );
}
