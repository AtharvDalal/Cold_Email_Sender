import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cold Email Sender",
  description: "Send job applications via email easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="p-4 bg-gray-900 text-white flex justify-between">
          <Link href="/pages/register" className="mr-4">
            Register
          </Link>
          <Link href="/pages/login" className="mr-4">
            Login
          </Link>
          <Link href="/pages/send-email">Send Email</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
