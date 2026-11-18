import os from "node:os";
export default {
  id: "server", command: "server", category: "Info",
  description: "Show runtime and server information",
  async execute({ reply }) {
    const mib = n => (n / 1024 / 1024).toFixed(0) + " MB";
    await reply(["🖥️ Runtime information", "Node: " + process.version, "Platform: " + process.platform + " / " + os.arch(), "Memory: " + mib(process.memoryUsage().rss), "Uptime: " + Math.floor(process.uptime()) + " seconds"].join("\n"));
  }
};