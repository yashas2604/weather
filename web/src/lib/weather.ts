export interface WeatherData {
  current: {
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weatherCode: number;
    cloudCover: number;
    pressureMsl: number;
    surfacePressure: number;
    windSpeed10m: number;
    windDirection10m: number;
    windGusts10m: number;
  };
  hourly: {
    time: string[];
    temperature2m: number[];
    weatherCode: number[];
    windSpeed10m: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperature2mMax: number[];
    temperature2mMin: number[];
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  // Using Open-Meteo API for current, hourly (24h) and daily (7 days)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
  
  const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60s
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  return {
    current: {
      temperature2m: data.current.temperature_2m,
      relativeHumidity2m: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      isDay: data.current.is_day,
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      pressureMsl: data.current.pressure_msl,
      surfacePressure: data.current.surface_pressure,
      windSpeed10m: data.current.wind_speed_10m,
      windDirection10m: data.current.wind_direction_10m,
      windGusts10m: data.current.wind_gusts_10m,
    },
    hourly: {
      time: data.hourly.time.slice(0, 24), // Next 24 hours
      temperature2m: data.hourly.temperature_2m.slice(0, 24),
      weatherCode: data.hourly.weather_code.slice(0, 24),
      windSpeed10m: data.hourly.wind_speed_10m.slice(0, 24),
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperature2mMax: data.daily.temperature_2m_max,
      temperature2mMin: data.daily.temperature_2m_min,
    }
  };
}

// Map WMO weather codes to human-readable strings and icons
export function getWeatherDetails(code: number, isDay: number = 1) {
  const codes: Record<number, { text: string; icon: string }> = {
    0: { text: "Clear sky", icon: isDay ? "sun" : "moon" },
    1: { text: "Mainly clear", icon: isDay ? "cloud-sun" : "cloud-moon" },
    2: { text: "Partly cloudy", icon: isDay ? "cloud-sun" : "cloud-moon" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Fog", icon: "cloud-fog" },
    48: { text: "Depositing rime fog", icon: "cloud-fog" },
    51: { text: "Light drizzle", icon: "cloud-drizzle" },
    53: { text: "Moderate drizzle", icon: "cloud-drizzle" },
    55: { text: "Dense drizzle", icon: "cloud-drizzle" },
    56: { text: "Light freezing drizzle", icon: "cloud-hail" },
    57: { text: "Dense freezing drizzle", icon: "cloud-hail" },
    61: { text: "Slight rain", icon: "cloud-rain" },
    63: { text: "Moderate rain", icon: "cloud-rain" },
    65: { text: "Heavy rain", icon: "cloud-rain" },
    66: { text: "Light freezing rain", icon: "cloud-hail" },
    67: { text: "Heavy freezing rain", icon: "cloud-hail" },
    71: { text: "Slight snow fall", icon: "cloud-snow" },
    73: { text: "Moderate snow fall", icon: "cloud-snow" },
    75: { text: "Heavy snow fall", icon: "cloud-snow" },
    77: { text: "Snow grains", icon: "cloud-snow" },
    80: { text: "Slight rain showers", icon: "cloud-rain" },
    81: { text: "Moderate rain showers", icon: "cloud-rain" },
    82: { text: "Violent rain showers", icon: "cloud-lightning" },
    85: { text: "Slight snow showers", icon: "cloud-snow" },
    86: { text: "Heavy snow showers", icon: "cloud-snow" },
    95: { text: "Thunderstorm", icon: "cloud-lightning" },
    96: { text: "Thunderstorm with slight hail", icon: "cloud-lightning" },
    99: { text: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
  };

  return codes[code] || { text: "Unknown", icon: "cloud" };
}
