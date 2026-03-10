import { fetchWeather, getWeatherDetails } from "@/lib/weather";
import { MapPin, Wind, Droplets, Sun, Activity, CloudRain, Thermometer, CloudFog, CloudDrizzle, CloudHail, CloudSnow, CloudLightning, Cloud, Moon, CloudSun, CloudMoon } from "lucide-react";

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const IconMap: Record<string, any> = {
    "sun": Sun,
    "moon": Moon,
    "cloud-sun": CloudSun,
    "cloud-moon": CloudMoon,
    "cloud": Cloud,
    "cloud-fog": CloudFog,
    "cloud-drizzle": CloudDrizzle,
    "cloud-rain": CloudRain,
    "cloud-hail": CloudHail,
    "cloud-snow": CloudSnow,
    "cloud-lightning": CloudLightning,
  };
  const Icon = IconMap[name] || Cloud;
  return <Icon className={className} />;
}

export async function WeatherWidget({ lat, lon, name, initialWeather }: { lat: number, lon: number, name: string, initialWeather?: any }) {
  const weather = initialWeather || await fetchWeather(lat, lon);
  const currentDetails = getWeatherDetails(weather.current.weatherCode, weather.current.isDay);

  // Derive background classes based on weather
  const isRainy = [51,53,55,56,57,61,63,65,66,67,80,81,82].includes(weather.current.weatherCode);
  const isCloudy = [3, 45, 48].includes(weather.current.weatherCode);
  const isClear = [0, 1].includes(weather.current.weatherCode);

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white/90">
      
      {/* Current Weather Hero */}
      <div className="glass-panel rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden group border border-white/20 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000 ease-out">
           <div className="w-96 h-96 bg-white rounded-full blur-[80px] mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-white/80" />
              <h2 className="text-4xl font-semibold tracking-tight text-white">{decodeURIComponent(name)}</h2>
            </div>
            <p className="text-xl text-white/70 mb-8 font-light tracking-wide uppercase">{currentDetails.text}</p>
            <div className="text-[9rem] leading-none font-light tracking-tighter text-white drop-shadow-lg">
              {Math.round(weather.current.temperature2m)}°
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:text-right text-lg w-full md:w-auto">
            <div className="glass rounded-3xl p-5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
              <Droplets className="w-8 h-8 mb-3 text-blue-200" strokeWidth={1.5} />
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Humidity</span>
              <span className="text-2xl font-light text-white">{weather.current.relativeHumidity2m}%</span>
            </div>
            <div className="glass rounded-3xl p-5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
              <Wind className="w-8 h-8 mb-3 text-teal-200" strokeWidth={1.5} />
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Wind</span>
              <span className="text-2xl font-light text-white">{weather.current.windSpeed10m} <span className="text-lg">km/h</span></span>
            </div>
            <div className="glass rounded-3xl p-5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
              <Thermometer className="w-8 h-8 mb-3 text-orange-200" strokeWidth={1.5} />
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Feels Like</span>
              <span className="text-2xl font-light text-white">{Math.round(weather.current.apparentTemperature)}°</span>
            </div>
            <div className="glass rounded-3xl p-5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
              <Activity className="w-8 h-8 mb-3 text-purple-200" strokeWidth={1.5} />
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Pressure</span>
              <span className="text-2xl font-light text-white">{weather.current.surfacePressure}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Forecast */}
        <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-8 border border-white/10 flex flex-col shadow-xl">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-8 flex items-center gap-3">
            <CloudRain className="w-5 h-5 text-white/50" />
            24-Hour Forecast
          </h3>
          <div className="flex overflow-x-auto gap-3 pb-6 pt-2 snap-x scrollbar-hide -mx-4 px-4 mask-edges flex-1 items-center">
            {weather.hourly.time.map((time: string, idx: number) => {
              if (idx % 2 !== 0) return null; // Show every 2 hours to save space
              const date = new Date(time);
              const hourStr = date.toLocaleTimeString([], { hour: 'numeric' });
              const details = getWeatherDetails(weather.hourly.weatherCode[idx]);
              
              return (
                <div key={time} className="snap-start shrink-0 glass hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 rounded-[2rem] py-6 px-4 flex flex-col items-center min-w-[110px] shadow-lg">
                  <span className="text-sm text-white/70 font-medium mb-4">{hourStr}</span>
                  <div className="w-14 h-14 glass rounded-full flex items-center justify-center mb-4">
                     <DynamicIcon name={details.icon} className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-light text-white tracking-tight">{Math.round(weather.hourly.temperature2m[idx])}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10 shadow-xl">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-8 flex items-center gap-3">
            <Sun className="w-5 h-5 text-white/50" />
            7-Day Forecast
          </h3>
          <div className="space-y-1">
            {weather.daily.time.map((time: string, idx: number) => {
              const date = new Date(time);
              const dayStr = idx === 0 ? 'Today' : date.toLocaleDateString([], { weekday: 'short' });
              const details = getWeatherDetails(weather.daily.weatherCode[idx]);

              return (
                <div key={time} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                  <span className="font-medium text-white/90 w-16 text-lg tracking-wide">{dayStr}</span>
                  <div className="flex items-center gap-4 flex-1 justify-center text-white/70 group-hover:text-white transition-colors">
                     <DynamicIcon name={details.icon} className="w-5 h-5" />
                     <span className="text-sm truncate max-w-[100px] font-medium" title={details.text}>{details.text}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-white/50 text-lg font-light w-8">{Math.round(weather.daily.temperature2mMin[idx])}°</span>
                    <span className="text-white font-light text-xl w-8 tracking-tight">{Math.round(weather.daily.temperature2mMax[idx])}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
