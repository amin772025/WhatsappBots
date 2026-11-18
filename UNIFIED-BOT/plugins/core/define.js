export default {
  id: "define", command: "define", aliases: ["meaning"], category: "Tools",
  description: "Look up an English word definition",
  async execute({ reply, args }) {
    const word = args.join(" ").trim();
    if (!/^[a-zA-Z-]{1,50}$/.test(word)) { await reply("Usage: .define word (English only)"); return; }
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error("Word not found.");
      const data = await response.json();
      const meanings = (data[0]?.meanings || []).slice(0, 3).map(item => {
        const definition = item.definitions?.[0]?.definition || "";
        return `${item.partOfSpeech}: ${definition}`;
      });
      await reply(`${data[0]?.word || word}\n\n${meanings.join("\n")}`.slice(0, 2500));
    } catch (error) { await reply(error.name === "TimeoutError" ? "Dictionary request timed out." : error.message); }
  }
};
