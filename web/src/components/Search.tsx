"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, MapPin, Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  timezone: string;
}

interface SearchProps {
  onLocationSelect?: (location: Location) => void;
}

export function Search({ onLocationSelect }: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    async function searchLocation() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(debouncedQuery)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Geocoding search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }

    searchLocation();
  }, [debouncedQuery]);

  const handleSelect = (location: Location) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    if (onLocationSelect) onLocationSelect(location);
    router.push(`/?lat=${location.latitude}&lon=${location.longitude}&name=${encodeURIComponent(location.name)}`);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50">
      <div className="relative flex items-center group">
        <div className="absolute left-6 text-white/50 transition-colors group-hover:text-white/80">
          {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <SearchIcon className="w-6 h-6" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // delay to allow clicks
          placeholder="Search city..."
          className={cn(
            "w-full h-16 pl-16 pr-6 glass hover:bg-white/10 focus:bg-white/10 focus:border-white/40",
            "rounded-[2rem] outline-none transition-all duration-300",
            "placeholder:text-white/40 placeholder:font-light text-white text-xl shadow-2xl"
          )}
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-20 left-0 right-0 glass-panel rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up border border-white/20">
          <ul className="py-2">
            {results.map((loc) => (
              <li key={loc.id}>
                <button
                  className="w-full text-left px-6 py-4 hover:bg-white/10 transition-colors flex flex-col group/btn"
                  onClick={() => handleSelect(loc)}
                >
                  <span className="text-white text-lg font-medium group-hover/btn:text-glow transition-all">{loc.name}</span>
                  <span className="text-white/50 text-sm flex items-center gap-2 mt-1 font-light tracking-wide">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
