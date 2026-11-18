export default {
  id: "stats",
  command: "stats",
  aliases: ["status"],
  category: "Info",
  description: "Show basic bot usage statistics",
  async execute({ reply, context, config }) {
    const data = context.runtime.store.read();
    const users = Object.keys(data.users || {}).length;
    const groups = Object.keys(data.chats || {}).filter(id => id.endsWith("@g.us")).length;
    const commands = Object.values(data.users || {}).reduce((sum, user) => sum + (Number(user.commands) || 0), 0);
    const lines = config.language === "ar"
      ? [`إحصائيات ${config.botName}`, `المستخدمون: ${users}`, `المجموعات: ${groups}`, `الأوامر المنفذة: ${commands}`]
      : [`${config.botName} statistics`, `Users: ${users}`, `Groups: ${groups}`, `Commands executed: ${commands}`];
    await reply(lines.join("\n"));
  }
};
