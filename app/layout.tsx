//layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import { Suspense } from "react";
import { AgentProvider } from "@/contexts/agentContext";
import { ModelProvider } from "@/contexts/modelContext";
import { LanguageProvider } from "@/contexts/languageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fact Checker",
  description: "AI-powered fact checking application",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AgentProvider>
          <ModelProvider>
            <LanguageProvider>
              <CopilotKit publicApiKey={process.env.publicApiKey}>
                <Suspense> {children}</Suspense>
              </CopilotKit>
            </LanguageProvider>
          </ModelProvider>
        </AgentProvider>
      </body>
    </html>
  );
}
