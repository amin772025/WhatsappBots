import { runUtility } from "./_utility-engine.js";
export default { id: "consonantcount", command: "consonantcount", category: "Info", description: "Count consonants", async execute({ args, reply }) { await runUtility("consonantcount", args, reply); } };
