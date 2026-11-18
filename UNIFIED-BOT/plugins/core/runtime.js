export default {
  id: "runtime",
  command: "runtime",
  aliases: ["uptime"],
  category: "Info",
  description: "Show how long the bot has been running",
  async execute({ reply, config }) {
    const total = Math.floor(process.uptime());
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const value = [hours && `${hours}h`, minutes && `${minutes}m`, `${seconds}s`].filter(Boolean).join(" ");
    await reply(config.language === "ar" ? `مدة التشغيل: ${value}` : `Uptime: ${value}`);
  }
};
