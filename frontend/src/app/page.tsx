"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [gameId, setGameId] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/game/${gameId}`);
    setGameId("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-600">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold text-white text-center">
          FlightGuessr
        </h1>
        <div
          className="bg-white rounded-md p-8 flex flex-col space-y-2"
        >
          <input
            required
            onChange={(e) => setGameId(e.target.value)}
            className="h-10 w-full border-2 border-gray-400 active:border-blue-400 rounded-md text-center font-semibold"
            type="text"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gray-600 font-bold text-white text-2xl h-10 w-64 rounded-md hover:bg-gray-700"
          >
            Join
          </button>
        </div>
      </div>
    </main>
  );
}
