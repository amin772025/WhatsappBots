export default {
  id: "lyrics",
  command: "lyrics",
  aliases: ["songinfo"],
  category: "Entertainment",
  description: "Find song metadata and official lyrics-page links",
  async execute({ reply, args }) {
    const query = args.join(" ").trim();
    if (!query || query.length > 120) {
      await reply("Usage: .lyrics song title or artist name");
      return;
    }
    try {
      const url = new URL("https://lrclib.net/api/search");
      url.search = new URLSearchParams({ q: query });
      const response = await fetch(url, {
        headers: { "User-Agent": "AminUnifiedWhatsAppBot/1.0" },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error("Lyrics search service is unavailable. Try again later.");
      const results = (await response.json()).slice(0, 5);
      if (!results.length) {
        await reply("No matching songs found.");
        return;
      }
      const lines = results.map((song, index) => {
        const duration = Number.isFinite(song.duration) ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, "0")}` : "Unknown";
        const title = String(song.trackName || "Unknown title").slice(0, 100);
        const artist = String(song.artistName || "Unknown artist").slice(0, 100);
        const album = String(song.albumName || "Unknown album").slice(0, 100);
        const page = `https://lrclib.net/search/${encodeURIComponent(title)}`;
        return `${index + 1}. ${title} — ${artist}\nAlbum: ${album} | Duration: ${duration}\nLyrics page: ${page}`;
      });
      await reply(lines.join("\n\n").slice(0, 3000));
    } catch (error) {
      await reply(error.name === "TimeoutError" ? "Lyrics search timed out. Try again." : error.message);
    }
  }
};
