"use client";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("/api/sign-up", {
          method: "GET",
        });
        if (!response.ok) throw new Error("Failed to fetch schedules");
        console.log(await response.json());
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      sign-up
    </div>
  );
}
