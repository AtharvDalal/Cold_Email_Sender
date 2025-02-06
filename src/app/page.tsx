"use client";

import React from "react";
import Link from "next/link";
import { BackgroundBeams } from "../components/ui/background-beams";

export default function Home() {
  return (
    <div className="antialiased relative min-h-screen bg-black">
      <BackgroundBeams />

      <main className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-2xl p-8 rounded-lg bg-gradient-to-b shadow-2xl relative text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg">
            Cold Email Sender
          </h1>
          <p className="text-neutral-400 mt-3">
            Streamline your job application process with Cold Email Sender!
            Effortlessly send personalized emails to HR with your resume,
            LinkedIn profile, and contact details in just a few clicks. Simplify
            outreach and boost your chances of landing your dream job. 🚀
          </p>

          <div className="mt-5 flex justify-center gap-4">
            <Link
              href="/pages/register"
              className="inline-block w-1/3 px-6 py-3 bg-amber-800 hover:bg-teal-600 text-white font-semibold rounded-md transition"
            >
              SignUP
            </Link>
            <Link
              href="/pages/login"
              className="inline-block w-1/3 px-6 py-3 bg-teal-600 hover:bg-amber-800 text-white font-semibold rounded-md transition"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
