import { runUtility } from "./_utility-engine.js";
export default { id: "listformat", command: "listformat", category: "Encoding", description: "Create numbered list", async execute({ args, reply }) { await runUtility("listformat", args, reply); } };
