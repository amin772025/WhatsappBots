export default {
  id: "weather", command: "weather", aliases: ["طقس"], category: "Info",
  description: "Get current weather by city using Open-Meteo",
  async execute({ reply, args, config }) {
    const city = args.join(" ").trim();
    if (!city || city.length > 80) { await reply("Usage: .weather city name"); return; }
    try {
      const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
      geoUrl.search = new URLSearchParams({ name: city, count: "1", language: config.language, format: "json" });
      const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(8000) });
      if (!geoRes.ok) throw new Error("Weather service is unavailable.");
      const geo = await geoRes.json();
      const place = geo.results?.[0];
      if (!place) throw new Error("City not found.");
      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.search = new URLSearchParams({
        latitude: String(place.latitude), longitude: String(place.longitude),
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
        timezone: "auto"
      });
      const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(8000) });
      if (!weatherRes.ok) throw new Error("Weather service is unavailable.");
      const data = await weatherRes.json();
      const current = data.current;
      const lines = config.language === "ar"
        ? [`الطقس في ${place.name}, ${place.country}`, `الحرارة: ${current.temperature_2m}°C (المحسوسة ${current.apparent_temperature}°C)`, `الرطوبة: ${current.relative_humidity_2m}%`, `الرياح: ${current.wind_speed_10m} كم/س`]
        : [`Weather in ${place.name}, ${place.country}`, `Temperature: ${current.temperature_2m}°C (feels like ${current.apparent_temperature}°C)`, `Humidity: ${current.relative_humidity_2m}%`, `Wind: ${current.wind_speed_10m} km/h`];
      await reply(lines.join("\n"));
    } catch (error) { await reply(error.name === "TimeoutError" ? "Weather request timed out." : error.message); }
  }
};
