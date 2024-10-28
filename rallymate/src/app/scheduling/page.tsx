"use client";
import Image from "next/image";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [startDate, setStartDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected Date and Time: ${startDate}`);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-semibold">Scheduler</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <label htmlFor="datePicker" className="text-lg">
          Choose Date and Time:
        </label>
        <DatePicker
          id="datePicker"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="border rounded px-4 py-2 text-center"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Availability
        </button>
      </form>

      <footer className="text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company
      </footer>
    </div>
  );
}
