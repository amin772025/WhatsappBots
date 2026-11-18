export default {
  id: "github", command: "github", aliases: ["gh", "ghsearch"], category: "Search",
  description: "Search public GitHub repositories",
  async execute({ reply, args }) {
    const query = args.join(" ").trim();
    if (!query || query.length > 120) { await reply("Usage: .github search terms"); return; }
    try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`, {
        headers: { accept: "application/vnd.github+json", "user-agent": "Amin-Unified-WhatsApp-Bot" },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(response.status === 403 ? "GitHub search rate limit reached. Try again later." : "GitHub search is temporarily unavailable.");
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) { await reply("No public repositories found for that search."); return; }
      const output = items.map((item, index) =>
        `${index + 1}. ${item.full_name}\n⭐ ${Number(item.stargazers_count || 0).toLocaleString("en-US")}  ·  Forks: ${Number(item.forks_count || 0).toLocaleString("en-US")}\n${String(item.description || "No description").slice(0, 180)}\n${item.html_url}`
      ).join("\n\n");
      await reply(`GitHub results for: ${query}\n\n${output}`);
    } catch (error) {
      await reply(error.name === "TimeoutError" ? "GitHub search timed out. Try again." : error.message || "Could not search GitHub.");
    }
  }
};
