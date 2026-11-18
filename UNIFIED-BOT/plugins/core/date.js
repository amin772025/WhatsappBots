export default {
  id: "date", command: ["date", "today"], category: "Info",
  description: "Show current date and time",
  async execute({ reply, config }) {
    const locale = config.language === "ar" ? "ar-EG" : "en-US";
    await reply("🕒 " + new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Cairo" }).format(new Date()));
  }
};