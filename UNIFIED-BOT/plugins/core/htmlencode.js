import { runUtility } from "./_utility-engine.js";
export default { id: "htmlencode", command: "htmlencode", category: "Encoding", description: "Escape HTML", async execute({ args, reply }) { await runUtility("htmlencode", args, reply); } };
