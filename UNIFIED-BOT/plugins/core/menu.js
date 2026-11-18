export default {
  id: "menu",
  command: "menu",
  aliases: ["help"],
  category: "General",
  description: "Show the command menu",
  async execute({ reply, config, context, args, message }) {
    const menu = context.runtime?.menu?.(args[0] || "", message?.displayName || "") || [
      `╭─「 ${config.botName} 」`,
      `│ Prefix: ${config.prefix}`,
      `│ Developer: ${config.developer}`,
      `╰────────────`
    ].join("\n");
    await reply(menu);
  }
};
