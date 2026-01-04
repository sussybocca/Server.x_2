"use client";

import { useEffect, useState } from "react";
import { getServers } from "@/lib/server-loader";

interface AddressBarProps {
  value: string;
  onSubmit: (url: string) => void;
}

export default function AddressBar({ value, onSubmit }: AddressBarProps) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  // Keep input synced with value
  useEffect(() => setInput(value), [value]);

  // Fetch server URLs for autocomplete
  useEffect(() => {
    async function fetchServers() {
      const urls = await getServers();
      setSuggestions(urls);
    }
    fetchServers();
  }, []);

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (hoverIndex >= 0) {
        onSubmit(filtered[hoverIndex]);
      } else {
        onSubmit(input);
      }
    } else if (e.key === "ArrowDown") {
      setHoverIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setHoverIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="p-2 bg-zinc-800 flex flex-col gap-1 relative">
      {/* Input and Go Button */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-black text-white outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setHoverIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter server URL..."
        />
        <button
          onClick={() => onSubmit(input)}
          className="bg-blue-600 px-4 rounded-lg hover:bg-blue-500 transition"
        >
          Go
        </button>
      </div>

      {/* Autocomplete suggestions */}
      {filtered.length > 0 && (
        <ul className="absolute top-14 left-2 right-2 bg-zinc-900 text-white rounded-lg max-h-48 overflow-y-auto shadow-lg z-10">
          {filtered.map((url, idx) => (
            <li
              key={url}
              className={`p-2 cursor-pointer ${
                hoverIndex === idx ? "bg-blue-600" : "hover:bg-zinc-700"
              }`}
              onClick={() => onSubmit(url)}
              onMouseEnter={() => setHoverIndex(idx)}
            >
              {url}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
