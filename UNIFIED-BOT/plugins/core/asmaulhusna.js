const names = ["Ar-Rahman — The Most Merciful","Ar-Raheem — The Especially Merciful","Al-Malik — The King","Al-Quddus — The Most Holy","As-Salam — The Source of Peace","Al-Aziz — The Almighty","Al-Hakim — The All-Wise","Al-Alim — The All-Knowing"];
export default {
  id: "asmaulhusna", command: ["asmaulhusna", "asma"], category: "Knowledge",
  description: "Share one of the beautiful names of Allah",
  async execute({ reply }) {
    const name = names[Math.floor(Math.random() * names.length)];
    await reply("أسماء الله الحسنى\n" + name);
  }
};