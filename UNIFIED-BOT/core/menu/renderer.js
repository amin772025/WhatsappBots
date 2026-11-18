export function renderMenu({ config, plugins, userName = "", uptimeSeconds = 0 }) {
  const grouped = new Map();
  for (const plugin of plugins) {
    if (!grouped.has(plugin.category)) grouped.set(plugin.category, []);
    grouped.get(plugin.category).push(plugin);
  }
  const lines = [
    `╭─「 ${config.botName} 」`,
    `│ أهلاً ${userName || "بك"}`,
    `│ المطور: ${config.developer}`,
    `│ المالك: ${config.ownerName}`,
    `│ Prefix: ${config.prefix}`,
    `│ التشغيل: ${Math.max(0, Math.floor(uptimeSeconds))} ثانية`,
    "╰────────────"
  ];
  for (const [category, entries] of grouped) {
    lines.push("", `【 ${category} 】`);
    for (const plugin of entries) {
      const command = plugin.commands[0];
      lines.push(`• ${config.prefix}${command}${plugin.description ? ` — ${plugin.description}` : ""}`);
    }
  }
  lines.push("", `للتواصل: ${config.contactUsername}`);
  return lines.join("\n");
}
