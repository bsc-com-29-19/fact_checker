// ModelSelectorWrapper.tsx

"use client";

import { ResearchProvider } from "@/lib/research-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { ResearchWrapper } from "@/components/ResearchWrapper";
import { ModelProvider } from "@/contexts/modelContext";
import { AgentProvider } from "@/contexts/agentContext";
import { LanguageProvider } from "@/contexts/languageContext";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function ModelSelectorWrapper() {
  const useLgc = true;
  const currentRuntimeUrl = useLgc ? "/api/copilotkit-lgc" : "/api/copilotkit";

  return (
    // 1. CRITICAL: Use 'h-screen' for a fixed viewport height, not 'min-h-screen'.
    // 'overflow-hidden' prevents the whole page from scrolling.
    <main className="h-screen overflow-hidden bg-gray-50 dark:bg-[#212121] dark:text-gray flex flex-col">
      <ModelProvider>
        <LanguageProvider>
          <CopilotKit
            runtimeUrl={currentRuntimeUrl}
            agent="fact_checker_agent"
            showDevConsole={false}
          >
            <SignedOut>
              {/* Signed out content can scroll normally if it's long */}
              <div className="overflow-y-auto">
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
                  <div className="w-full max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl text-[#6766FC] font-bold mb-8">
                      Ngamo
                    </h1>
                    <h1 className="text-2xl md:text-3xl text-black dark:text-white font-bold mb-4">
                      AI-Powered Fact-Checking System
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-white/70 mb-8">
                      Verify claims, explore sources, and ensure accuracy with
                      our advanced AI tools.
                    </p>

                    {/* Call-to-Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                      <Link href="/sign-in">
                        <button className="w-full sm:w-auto rounded-md border-2 border-transparent bg-[#6766FC] px-10 py-3 text-white font-semibold hover:bg-transparent hover:text-[#6766FC] hover:border-[#6766FC]">
                          Sign In
                        </button>
                      </Link>
                      <Link href="/sign-up">
                        <button className="w-full sm:w-auto rounded-md bg-transparent border-2 text-[#6766FC] border-[#6766FC] px-10 py-3 font-semibold hover:bg-[#6766FC] hover:text-white hover:border-[#6766FC]">
                          Sign Up
                        </button>
                      </Link>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-[#404040] p-6 rounded-lg shadow-md">
                        <div className="text-3xl mb-4">🧠</div>
                        <h3 className="text-xl text-black dark:text-white font-semibold mb-2">
                          AI-Powered Fact-Checking
                        </h3>
                        <p className="text-gray-600 dark:text-white/80">
                          Our advanced AI analyzes claims in real-time,
                          cross-referencing trusted sources to ensure accuracy.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-[#404040] p-6 rounded-lg shadow-md">
                        <div className="text-3xl mb-4">🔍</div>
                        <h3 className="text-xl text-black dark:text-white font-semibold mb-2">
                          Research Support
                        </h3>
                        <p className="text-gray-600 dark:text-white/80">
                          Dive deep into sources with tools designed to help you
                          validate information efficiently.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-[#404040] p-6 rounded-lg shadow-md">
                        <div className="text-3xl mb-4">🌐</div>
                        <h3 className="text-xl text-black dark:text-white font-semibold mb-2">
                          User-Friendly Interface
                        </h3>
                        <p className="text-gray-600 dark:text-white/80">
                          Intuitive design makes fact-checking accessible to
                          everyone, from beginners to experts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SignedOut>

            {/* --- THE CORRECTED SIGNED-IN LAYOUT --- */}
            <SignedIn>
              {/* 2. Header: A standard block element with a fixed height. */}
              <header className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-[#212121] border-b dark:border-gray-700 flex-shrink-0">
                <div className="flex-1">
                  <Header />
                </div>
                <div className="ml-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </header>

              {/* 3. Main Content Area: This is now the ONE scrollable pane. */}
              {/* 'flex-1' makes it grow to fill the remaining space. */}
              {/* 'overflow-y-auto' makes it scrollable on all devices, including touch. */}
              <div className="flex-1 overflow-y-auto touch-pan-y touch-auto">
                <AgentProvider>
                  <ResearchProvider>
                    <ResearchWrapper />
                  </ResearchProvider>
                </AgentProvider>
              </div>
            </SignedIn>
          </CopilotKit>
        </LanguageProvider>
      </ModelProvider>
    </main>
  );
}
