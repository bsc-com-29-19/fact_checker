//layout.tsx
import type { Metadata } from "next";
import { Roboto, Inter, Mukta } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

// Initialize Roboto font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"], // Optimize for Latin characters
  weight: ["400", "500", "600", "700"], // Common weights
  variable: "--font-inter", // Optional: Use CSS variable
});



// Initialize Mukta font
const mukta = Mukta({
  subsets: ["latin"], // Optimize for Latin characters
  weight: ["300", "400", "500", "600", "700", "800"], // Available weights
  variable: "--font-mukta", // Optional: CSS variable name
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
      <body className={`${roboto.className} ${inter.className} antialiased`}>
        <Suspense> {children}</Suspense>
      </body>
    </html>
  );
}
