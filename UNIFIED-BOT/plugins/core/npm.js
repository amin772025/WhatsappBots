export default {
  id: "npm", command: "npm", aliases: ["npmsearch"], category: "Search",
  description: "Search public npm packages",
  async execute({ reply, args }) {
    const query = args.join(" ").trim();
    if (!query || query.length > 120) { await reply("Usage: .npm package or keywords"); return; }
    try {
      const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`, {
        headers: { accept: "application/json", "user-agent": "Amin-Unified-WhatsApp-Bot" },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error("npm registry is temporarily unavailable.");
      const data = await response.json();
      const items = Array.isArray(data.objects) ? data.objects : [];
      if (!items.length) { await reply("No npm packages found for that search."); return; }
      const output = items.map((entry, index) => {
        const item = entry.package || {};
        const name = String(item.name || "unknown");
        return `${index + 1}. ${name}  (v${String(item.version || "?")})\n${String(item.description || "No description").slice(0, 180)}\nhttps://www.npmjs.com/package/${encodeURIComponent(name)}`;
      }).join("\n\n");
      await reply(`npm results for: ${query}\n\n${output}`);
    } catch (error) {
      await reply(error.name === "TimeoutError" ? "npm search timed out. Try again." : error.message || "Could not search npm.");
    }
  }
};
