const categoryOrder = ["General", "Main", "Group", "Tools", "Downloader", "AI", "Games", "Owner", "Info"];

export function renderMenu({ config, plugins, userName = "", uptimeSeconds = 0, category = "" }) {
  const grouped = new Map();
  for (const plugin of plugins) {
    if (!grouped.has(plugin.category)) grouped.set(plugin.category, []);
    grouped.get(plugin.category).push(plugin);
  }
  const categories = [...grouped.keys()].sort((a, b) => {
    const ai = categoryOrder.findIndex(x => x.toLowerCase() === a.toLowerCase());
    const bi = categoryOrder.findIndex(x => x.toLowerCase() === b.toLowerCase());
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b);
  });
  const ar = config.language === "ar";
  const uptime = Math.max(0, Math.floor(uptimeSeconds));
  const header = [
    `╭━━「 ${config.botName} 」━━╮`,
    `${ar ? "│ أهلاً" : "│ Hello"} ${userName || (ar ? "بك" : "there")}`,
    `│ ${ar ? "المطور" : "Developer"}: ${config.developer}`,
    `│ ${ar ? "المالك" : "Owner"}: ${config.ownerName}`,
    `│ Prefix: ${config.prefix}`,
    `│ ${ar ? "وقت التشغيل" : "Uptime"}: ${uptime}s`,
    `│ ${ar ? "عدد الأوامر" : "Commands"}: ${plugins.length}`,
    "╰━━━━━━━━━━━━━━━━━━╯"
  ];

  if (category && category.toLowerCase() !== "all") {
    const match = categories.find(item => item.toLowerCase() === category.toLowerCase());
    if (!match) {
      return [...header, "", ar ? "الأقسام المتاحة:" : "Available categories:",
        ...categories.map(name => `• ${name} (${grouped.get(name).length}) — ${config.prefix}menu ${name}`),
        "", ar ? "اكتب اسم القسم بعد menu لعرض أوامره." : "Use menu <category> to view its commands."
      ].join("\n");
    }
    const entries = grouped.get(match);
    return [...header, "", `【 ${match} · ${entries.length} 】`,
      ...entries.map(plugin => {
        const command = plugin.commands[0];
        return `• ${config.prefix}${command}${plugin.description ? ` — ${plugin.description}` : ""}`;
      }),
      "", `${config.prefix}menu` + (ar ? " للعودة للأقسام" : " to return to categories")
    ].join("\n");
  }

  const lines = [...header, "", ar ? "اختر قسماً لعرض أوامره:" : "Choose a category:"];
  for (const name of categories) {
    lines.push(`▸ ${name}  [${grouped.get(name).length}] — ${config.prefix}menu ${name}`);
  }
  lines.push("", ar
    ? `اكتب ${config.prefix}menu all لعرض كل الأوامر.`
    : `Type ${config.prefix}menu all to show every command.`);
  lines.push(`Contact: ${config.contactUsername}`);
  return lines.join("\n");
}
