// app/layout.tsx
// import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const openSansFont = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSansFont.className}`}
    >
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
