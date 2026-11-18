export default {
  id: "translate", command: "translate", aliases: ["tr"], category: "Tools",
  description: "Translate text using the free MyMemory service",
  async execute({ reply, args }) {
    const target = (args[0] || "en").toLowerCase();
    const text = args.slice(1).join(" ").trim();
    if (!/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(target) || !text || text.length > 500) {
      await reply("Usage: .translate en text to translate (max 500 characters)"); return;
    }
    try {
      const url = new URL("https://api.mymemory.translated.net/get");
      url.search = new URLSearchParams({ q: text, langpair: `auto|${target}` });
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error("Translation service is unavailable.");
      const data = await response.json();
      const result = data.responseData?.translatedText;
      if (!result) throw new Error("No translation returned.");
      await reply(String(result).slice(0, 2500));
    } catch (error) { await reply(error.name === "TimeoutError" ? "Translation request timed out." : error.message); }
  }
};
