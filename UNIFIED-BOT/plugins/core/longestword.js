import { runUtility } from "./_utility-engine.js";
export default { id: "longestword", command: "longestword", category: "Info", description: "Find longest word", async execute({ args, reply }) { await runUtility("longestword", args, reply); } };
