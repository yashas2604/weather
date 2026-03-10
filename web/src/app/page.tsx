import { Search } from "@/components/Search";
import { WeatherWidget } from "@/components/WeatherWidget";
import { WeatherBackground } from "@/components/WeatherBackground";
import { fetchWeather } from "@/lib/weather";
import { GeoRedirect } from "@/components/GeoRedirect";

export default async function Home({ searchParams }: { searchParams: Promise<{ lat?: string, lon?: string, name?: string }> }) {
  const resolvedParams = await searchParams;
  const { lat, lon, name } = resolvedParams;

  const hasLocation = lat && lon && name;
  let weatherCode = 0;
  let isDay = 1;
  let weatherData = null;

  if (hasLocation) {
    try {
      weatherData = await fetchWeather(Number(lat), Number(lon));
      weatherCode = weatherData.current.weatherCode;
      isDay = weatherData.current.isDay;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden transition-colors duration-1000">
      <GeoRedirect />
      
      {hasLocation ? (
        <WeatherBackground weatherCode={weatherCode} isDay={isDay} />
      ) : (
        <div className="fixed inset-0 -z-10 overflow-hidden">
           <div 
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: 'url("/aesthetic_weather_bg.png")' }}
           >
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
           </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <header className="mb-12 flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white animate-fade-in text-glow drop-shadow-2xl">
            Weather
          </h1>
          <p className="text-white/60 text-lg animate-slide-up mb-4">
            Search for any city around the world
          </p>
          <Search />
        </header>

        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {hasLocation && weatherData ? (
            <WeatherWidget lat={Number(lat)} lon={Number(lon)} name={name} initialWeather={weatherData} />
          ) : hasLocation ? (
            <div className="w-full h-64 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center text-white/40">
              <p>Loading weather data...</p>
            </div>
          ) : (
            <div className="w-full h-64 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center text-white/40">
              <p>Type a city name to get started.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
