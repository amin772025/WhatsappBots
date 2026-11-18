const duas = [
  "رَبِّ زِدْنِي عِلْمًا",
  "اللَّهُمَّ يَسِّرْ وَلَا تُعَسِّرْ، وَتَمِّمْ بِالْخَيْرِ",
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
  "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
];
export default {
  id: "doa", command: ["doa", "dua"], category: "Knowledge",
  description: "Share a short supplication",
  async execute({ reply }) {
    await reply("🤲 دعاء\n" + duas[Math.floor(Math.random() * duas.length)]);
  }
};