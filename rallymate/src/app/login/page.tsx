"use client";

export default function Home() {

  return (
  <div className="flex items-center justify-center min-h-screen">
    <div className="grid items-center justify-items-center gap-20 p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <img src="/rallymate-logo.png" alt="RallyMate logo" className="w-40" />
      <form className="grid grid-rows-[1fr_1fr_1fr] gap-4">
        <input type="text" placeholder="Email" className="p-2 border border-gray-300 text-black rounded-md" />
        <input type="password" placeholder="Password" className="p-2 border text-black border-gray-300 rounded-md" />
        <button className="p-2 bg-primary text-black rounded-md">Sign in</button>
      </form>
    </div>
  </div>
  );
}
