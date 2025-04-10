// ThemeProvider.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <html lang="en" className="h-full">
        <body className="h-full">
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}