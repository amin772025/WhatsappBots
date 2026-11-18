export default {
  id: "tasbih", command: "tasbih", category: "Knowledge",
  description: "Show a short remembrance phrase",
  async execute({ reply }) {
    const phrases = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "اللَّهُ أَكْبَرُ", "أَسْتَغْفِرُ اللَّهَ"];
    await reply("📿 " + phrases[Math.floor(Math.random() * phrases.length)]);
  }
};