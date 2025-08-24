// components/Header.tsx
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function NavHeader() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          Fact Checker App
        </Link>
        <div className="space-x-4">
          <SignedOut>
            <Link href="/sign-in" className="hover:underline">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:underline">
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
