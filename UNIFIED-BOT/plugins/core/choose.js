export default {
  id: "choose", command: "choose", aliases: ["pick"], category: "General",
  description: "Choose one item from a list separated by |",
  async execute({ reply, args }) {
    const items = args.join(" ").split("|").map(x => x.trim()).filter(Boolean).slice(0, 30);
    if (items.length < 2) { await reply("Usage: .choose tea | coffee | water"); return; }
    await reply("🎯 " + items[Math.floor(Math.random() * items.length)]);
  }
};
