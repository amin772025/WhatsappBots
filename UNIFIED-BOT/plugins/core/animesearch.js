export default {
  id: "animesearch",
  command: "animesearch",
  aliases: ["mal", "بحث_انمي"],
  category: "Entertainment",
  description: "Search public anime metadata using the free Jikan API",
  async execute({ reply, args }) {
    const query = args.join(" ").trim();
    if (!query || query.length > 100) {
      await reply("Usage: .animesearch anime title");
      return;
    }
    try {
      const url = new URL("https://api.jikan.moe/v4/anime");
      url.search = new URLSearchParams({ q: query, limit: "5", sfw: "true" });
      const response = await fetch(url, {
        headers: { "User-Agent": "AminUnifiedWhatsAppBot/1.0" },
        signal: AbortSignal.timeout(12000)
      });
      if (!response.ok) throw new Error(response.status === 429 ? "Anime search is busy. Try again shortly." : "Anime search service is unavailable.");
      const payload = await response.json();
      const results = (payload.data || []).slice(0, 5);
      if (!results.length) {
        await reply("No anime found for that title.");
        return;
      }
      const output = results.map((item, index) => {
        const genres = (item.genres || []).slice(0, 3).map(genre => genre.name).join(", ") || "Unknown";
        const synopsis = String(item.synopsis || "No synopsis available.").replace(/\\s+/g, " ").slice(0, 280);
        return `${index + 1}. ${item.title}\n⭐ ${item.score ?? "N/A"} | Episodes: ${item.episodes ?? "?"} | ${item.status || "Unknown"}\nGenres: ${genres}\n${synopsis}\n${item.url || ""}`;
      });
      await reply(output.join("\n\n").slice(0, 3500));
    } catch (error) {
      await reply(error.name === "TimeoutError" ? "Anime search timed out. Try again." : error.message);
    }
  }
};
