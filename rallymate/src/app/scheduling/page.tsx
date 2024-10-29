"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SchedulingPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Date[]>([]);

  const userId = "your-user-id"; // Replace with the actual user ID, possibly from user context/auth

  const handleConfirm = async () => {
    if (startDate) {
      // Send the selected date to the backend
      try {
        const response = await fetch("/api/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            availabilityTime: startDate.toISOString(),
          }),
        });

        if (response.ok) {
          // const newAvailability = await response.json();
          setAvailability((prev) => [...prev, startDate]);
          setStartDate(null); // Clear the date picker after confirming
        } else {
          console.error("Failed to save availability");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleRemove = (dateToRemove: Date) => {
    setAvailability((prev) =>
      prev.filter((date) => date.getTime() !== dateToRemove.getTime())
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-10 font-[family-name:var(--font-geist-sans)] bg-gray-50">
      <h1 className="text-3xl font-semibold">Scheduler</h1>

      {/* Calendar Selection */}
      <div className="flex flex-col items-center bg-white shadow-md p-6 rounded-md">
        <label htmlFor="datePicker" className="text-xl mb-4">
          Select Your Availability
        </label>
        <DatePicker
          id="datePicker"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="border border-gray-300 rounded px-4 py-2 text-center"
        />
        <button
          onClick={handleConfirm}
          disabled={!startDate}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Confirm Selection
        </button>
      </div>

      {/* Selected Availability Display */}
      {availability.length > 0 && (
        <div className="flex flex-col items-center bg-white shadow-md p-6 rounded-md w-full max-w-md">
          <h2 className="text-xl font-medium mb-2">Your Selected Availability</h2>
          <ul className="space-y-2 w-full">
            {availability.map((date, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <span className="text-lg text-gray-700">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => handleRemove(date)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Your Company
      </footer>
    </div>
  );
}
