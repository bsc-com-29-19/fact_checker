// app/layout.tsx
// import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";
import {
  ClerkProvider,

} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
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
