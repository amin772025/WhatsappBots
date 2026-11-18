export default {
  id: "menu",
  command: "menu",
  category: "General",
  description: "Show the command menu",
  async execute({ reply, config, context }) {
    const menu = context.runtime?.menu?.(context.message?.senderNumber) || [
      `╭─「 ${config.botName} 」`,
      `│ Prefix: ${config.prefix}`,
      `│ Developer: ${config.developer}`,
      `╰────────────`
    ].join("\\n");
    await reply(menu);
  }
};
