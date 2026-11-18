import { runUtility } from "./_utility-engine.js";
export default { id: "sortlines", command: "sortlines", category: "Text", description: "Sort lines", async execute({ args, reply }) { await runUtility("sortlines", args, reply); } };
