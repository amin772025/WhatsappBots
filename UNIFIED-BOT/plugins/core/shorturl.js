export default {
  id: "shorturl", command: ["shorturl", "shorten"], category: "Tools",
  description: "Shorten a public URL using is.gd",
  async execute({ args, reply }) {
    const raw = args[0] || "";
    let url;
    try { url = new URL(raw); } catch { return reply("Usage: .shorturl https://example.com"); }
    if (!["http:", "https:"].includes(url.protocol)) return reply("Only HTTP and HTTPS links are supported.");
    try {
      const response = await fetch("https://is.gd/create.php?format=simple&url=" + encodeURIComponent(url.href), { signal: AbortSignal.timeout(8000) });
      const result = (await response.text()).trim();
      if (!response.ok || !/^https:\/\/is\.gd\/[\w]+$/.test(result)) return reply("The shortening service did not return a valid link.");
      await reply("Short link: " + result);
    } catch { await reply("Could not reach the URL-shortening service."); }
  }
};