# Next-Level Realistic Weather Application

A truly immersive, ultra-premium weather dashboard built with Next.js, React, Tailwind CSS v4, and the Open-Meteo API. 

## Features

- **Ultra-Realistic Global Weather State**: The application's core aesthetic shifts dynamically based on live weather data retrieved via coordinate mapping.
  - ☔️ **Rain System**: A multi-layered, infinite-tiling, CSS-based particle system with dynamic depth of field and simulated lightning flashes for thunderstorms.
  - ❄️ **Snow System**: Soft, drifting volumetric snowflakes scaled across three varying focal depths.
  - ☁️ **Cloud System**: Volumetric CSS radial blurs dynamically scaling opacity based on local cloud-cover percentage.
  - ☀️ **Sun/Clear**: Emissive lens flares masking with screen blending modes based on time-of-day calculations.
- **visionOS-Style Glassmorphism UI**:
  - Achieved using advanced `backdrop-filter: blur(30px) saturate(160%)` layers combined with internal sub-pixel borders to create true tangible volume.
  - All weather cards float across the physics viewport using exaggerated drop shadows (`0 20px 40px -10px rgba(0,0,0,0.5)`).
- **Intelligent Search Routing**:
  - Live debounce-enabled global city searching via Open-Meteo Geocoding.
  - Employs Next.js URL query params (`?lat=&lon=&name=`) for deep-linkable, statelessly cached weather forecasts.
- **Comprehensive Data Modeling**:
  - Current real-feel conditions.
  - 24-hour horizontal scrolling temperature timeline.
  - 7-day extended forecasting with high/low estimations.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Typography**: Inter (Variable)
- **Data Provider**: Open-Meteo API (Forecast & Geocoding)

## Getting Started

1. Navigate to the web application directory:
   ```bash
   cd web
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
