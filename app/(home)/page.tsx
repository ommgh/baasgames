"use client";

import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <>
      <div className="flex flex-col wrapper text-primary gap-3">
        <div className="max-w-screen py-20 min-h-screen">
          <Hero />
        </div>
      </div>
    </>
  );
}
