import { CopilotSidebar } from "@copilotkit/react-ui";
import CustomHeader from "@/components/CustomHeader";
import CustomWindow from "@/components/CustomWindow";
// import HomeView from "./HomeView";

export function ViewContainer() {
  return (
    <>
      {/* Copilot Sidebar */}
      <div
        className="w-[500px] h-full flex-shrink-0"
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
    </>
  );
}
