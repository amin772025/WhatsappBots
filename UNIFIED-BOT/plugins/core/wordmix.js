const words = ["computer", "elephant", "rainbow", "keyboard", "library", "triangle", "mountain", "whatsapp"];
function shuffle(text) { return text.split("").sort(() => Math.random() - 0.5).join(""); }
export default {
  id: "wordmix", command: ["wordmix", "scramble"], category: "Games",
  description: "Create a scrambled-word puzzle",
  async execute({ reply }) {
    const word = words[Math.floor(Math.random() * words.length)];
    let mixed = shuffle(word);
    if (mixed === word) mixed = word.slice(1) + word[0];
    await reply("🔤 Unscramble this word:\n" + mixed + "\n\nAnswer: " + word);
  }
};