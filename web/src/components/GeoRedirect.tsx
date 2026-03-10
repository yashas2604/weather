"use strict";
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function GeoRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lat = searchParams.get("lat");
    if (!lat && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get a name for this location using reverse geocoding
          try {
            const res = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=location&count=1`
            );
            // Open-Meteo doesn't have reverse geocoding by coords in the free search API easily, 
            // but we can just use "Current Location" as the name for now
            router.push(`/?lat=${latitude}&lon=${longitude}&name=Current%20Location`);
          } catch (e) {
            console.error(e);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [router, searchParams]);

  return null;
}
