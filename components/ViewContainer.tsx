import { CopilotSidebar } from "@copilotkit/react-ui";
import CustomHeader from "@/components/CustomHeader";
import CustomWindow from "@/components/CustomWindow";
import HomeView from "./HomeView";

export function ViewContainer() {
  return (
    <>
      <h1 className="flex w-full h-[60px] bg-[#0E103D] text-white items-center px-10 text-2xl font-medium">
        AI - Powered fact checker
      </h1>

      <div className="flex w-full" style={{ height: "calc(100vh - 60px)" }}>
        {/* HomeView section - takes remaining space */}
        <div className="flex-1 overflow-auto">
          <HomeView />
        </div>

        {/* CopilotSidebar section - fixed width */}
        <div
          className="w-48 h-full flex-shrink-0 border-l"
          style={
            {
              "--copilot-kit-background-color": "#E0E9FD",
              "--copilot-kit-secondary-color": "#6766FC",
              "--copilot-kit-separator-color": "#b8b8b8",
              "--copilot-kit-primary-color": "#FFFFFF",
              "--copilot-kit-contrast-color": "#000000",
              "--copilot-kit-secondary-contrast-color": "#000",
            } as any
          }
        >
          <CopilotSidebar
            defaultOpen={true}
            clickOutsideToClose={false}
            Input={() => null}
            Header={CustomHeader}
            Window={CustomWindow}
          />
        </div>
      </div>
    </>
  );
}
