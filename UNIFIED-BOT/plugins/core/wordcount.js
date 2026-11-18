import { runUtility } from "./_utility-engine.js";
export default { id: "wordcount", command: "wordcount", category: "Text", description: "Count words", async execute({ args, reply }) { await runUtility("wordcount", args, reply); } };
