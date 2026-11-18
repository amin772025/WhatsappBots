import { runUtility } from "./_utility-engine.js";
export default { id: "anagram", command: "anagram", category: "Text", description: "Check anagram using word1 | word2", async execute({ args, reply }) { await runUtility("anagram", args, reply); } };
