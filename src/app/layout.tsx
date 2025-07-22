import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import Providers from "@/components/Providers";
import UserMenu from "@/components/UserMenu";

export const metadata = {
  title: "MERN Full-Stack App",
  description: "A production-grade web application using Next.js 15",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <Providers>
          <header className="bg-white shadow p-4">
            <nav className="flex justify-between items-center">
              <div className="flex gap-4">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
                <Link href="/admin/users">Admin</Link>
                <Link href="/admin/audit">Audit Logs</Link>
                <Link href="/system-test" className="text-green-600 font-semibold">🧪 System Test</Link>
                <Link href="/oauth-config" className="text-blue-600">OAuth Config</Link>
              </div>
              <UserMenu />
            </nav>
          </header>
          <main className="p-6">{children}</main>
          <footer className="mt-auto bg-white p-4 text-center text-sm border-t">
            &copy; 2025 MERN Full-Stack Tutorial
          </footer>
        </Providers>
      </body>
    </html>
  );
}
