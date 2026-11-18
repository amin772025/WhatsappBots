const facts = [
  "Octopuses have three hearts.",
  "A day on Venus is longer than its year.",
  "Honey can remain stable for a very long time when stored properly.",
  "The first computer bug report involved an actual moth.",
  "Some bamboo species can grow remarkably quickly under ideal conditions.",
  "A group of flamingos is called a flamboyance."
];
export default {
  id: "fact", command: "fact", aliases: ["funfact"], category: "General",
  description: "Share a short general-knowledge fact",
  async execute({ reply }) { await reply("💡 " + facts[Math.floor(Math.random() * facts.length)]); }
};
