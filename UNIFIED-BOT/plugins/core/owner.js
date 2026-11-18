export default {
  id: "owner",
  command: "owner",
  aliases: ["creator"],
  category: "Info",
  description: "Show the configured bot owner contact details",
  async execute({ reply, config }) {
    const lines = [`Owner: ${config.ownerName}`];
    if (config.ownerLink) lines.push(`Contact: ${config.ownerLink}`);
    lines.push(`Developer: ${config.developer}`, `Support: ${config.contactUsername}`);
    await reply(lines.join("\n"));
  }
};
