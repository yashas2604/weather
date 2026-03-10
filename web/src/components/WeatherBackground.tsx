import { getWeatherDetails } from "@/lib/weather";

export function WeatherBackground({ weatherCode, isDay }: { weatherCode: number, isDay: number }) {
  const isRainy = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(weatherCode);
  const isThunderstorm = [95,96,99].includes(weatherCode);
  const isSnowy = [71,73,75,77,85,86].includes(weatherCode);
  const isCloudy = [3, 45, 48].includes(weatherCode);
  const isPartlyCloudy = [1, 2].includes(weatherCode);
  const isClear = [0].includes(weatherCode);

  // Determine base atmosphere
  let gradientClass = "";
  if (isRainy || isThunderstorm) {
    gradientClass = isDay ? "from-slate-700 via-slate-800 to-slate-950" : "from-gray-900 via-slate-950 to-black";
  } else if (isSnowy) {
    gradientClass = isDay ? "from-slate-300 via-blue-200 to-slate-400" : "from-slate-800 via-indigo-950 to-black";
  } else if (isCloudy) {
    gradientClass = isDay ? "from-gray-400 via-slate-400 to-gray-600" : "from-gray-800 via-slate-900 to-black";
  } else if (isClear || isPartlyCloudy) {
    gradientClass = isDay ? "from-sky-300 via-blue-400 to-blue-600" : "from-indigo-950 via-slate-900 to-black";
  } else {
    gradientClass = "from-slate-900 to-black";
  }

  return (
    <div className={`fixed inset-0 transition-colors duration-[3000ms] -z-10 overflow-hidden`}>
      {/* Aesthetic Base Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/aesthetic_weather_bg.png")' }}
      >
        {/* Dynamic Gradient Overlay to match weather atmosphere */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60 mix-blend-multiply transition-colors duration-[3000ms]`} />
        {/* Softening overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>
      
      {/* --- CLOUDS --- */}
      {(isCloudy || isPartlyCloudy || isRainy || isSnowy) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay">
          <div className={`absolute top-0 left-0 w-[80vw] h-[40vh] bg-white rounded-full blur-[100px] ${isCloudy || isRainy ? 'opacity-40' : 'opacity-20'} transform -translate-x-1/4 -translate-y-1/4`}></div>
          <div className={`absolute top-[20%] right-0 w-[60vw] h-[50vh] bg-white rounded-full blur-[120px] ${isCloudy || isRainy ? 'opacity-30' : 'opacity-10'} transform translate-x-1/4`}></div>
          <div className={`absolute bottom-0 left-[10%] w-[70vw] h-[60vh] bg-white rounded-full blur-[150px] ${isCloudy || isRainy ? 'opacity-40' : 'opacity-10'} transform translate-y-1/4`}></div>
        </div>
      )}

      {/* --- SUN / STARS --- */}
      {isDay && (isClear || isPartlyCloudy) && (
        <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-yellow-400 rounded-full mix-blend-screen opacity-40 blur-[100px] animate-pulse pointer-events-none"></div>
      )}
      {!isDay && (isClear || isPartlyCloudy) && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_rgba(0,0,0,0)_80%)]">
           <div className="absolute top-[20%] right-[20%] w-32 h-32 bg-slate-100 rounded-full mix-blend-screen opacity-80 blur-[4px] pointer-events-none shadow-[0_0_100px_rgba(255,255,255,0.5)]"></div>
        </div>
      )}

      {/* --- RAIN --- */}
      {isRainy && (
        <div className="absolute -inset-[20%] pointer-events-none">
          {/* Depth of field rain */}
          <div className="absolute inset-x-0 top-0 h-full rain-layer-3"></div>
          <div className="absolute inset-x-0 top-0 h-full rain-layer-2" style={{ animationDelay: '0.2s', left: '10%' }}></div>
          <div className="absolute inset-x-0 top-0 h-full rain-layer-1" style={{ animationDelay: '0.5s', left: '-5%' }}></div>
          {isThunderstorm && <div className="lightning-flash absolute inset-[20%]"></div>}
        </div>
      )}

      {/* --- SNOW --- */}
      {isSnowy && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 snow-layer-3"></div>
          <div className="absolute inset-0 snow-layer-2" style={{ animationDelay: '2s', left: '5%' }}></div>
          <div className="absolute inset-0 snow-layer-1" style={{ animationDelay: '5s', left: '-5%' }}></div>
        </div>
      )}
    </div>
  );
}
