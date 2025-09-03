'use client';
import { useState } from "react";

export const metadata = {
  title: 'Counter',  
};

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-72 rounded-xl bg-white p-6 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Counter</h1>
        <p className="text-lg text-gray-600 mb-6">Current count: <span className="font-semibold">{count}</span></p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 active:scale-95 transition"
          >
            Decrement
          </button>

          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600 active:scale-95 transition"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
