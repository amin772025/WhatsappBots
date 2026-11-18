export default {
  id: "wiki", command: "wiki", aliases: ["wikipedia"], category: "Info",
  description: "Get a short Wikipedia article summary",
  async execute({ reply, args, config }) {
    const title = args.join(" ").trim();
    if (!title || title.length > 100) { await reply("Usage: .wiki topic"); return; }
    try {
      const language = config.language === "ar" ? "ar" : "en";
      const url = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
      const response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error("No article found for that topic.");
      const data = await response.json();
      const summary = String(data.extract || "").slice(0, 2500);
      if (!summary) throw new Error("No summary available.");
      await reply(`${data.title}\n\n${summary}${data.content_urls?.desktop?.page ? `\n\n${data.content_urls.desktop.page}` : ""}`);
    } catch (error) { await reply(error.name === "TimeoutError" ? "Wikipedia request timed out." : error.message); }
  }
};
