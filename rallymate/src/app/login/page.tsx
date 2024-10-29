"use client";

import { login } from "@/app/actions/login";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid items-center justify-items-center gap-20 p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <img src="/rallymate-logo.png" alt="RallyMate logo" className="w-40" />
        <form action={login} className="grid grid-rows-[1fr_1fr_1fr] gap-4">
          <label htmlFor="email" className="text-secondary">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            className="p-2 border border-gray-300 text-black rounded-md"
          />

          <label htmlFor="password" className="text-secondary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="p-2 border text-black border-gray-300 rounded-md"
          />
          <button className="p-2 bg-primary text-black rounded-md">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
