import { runUtility } from "./_utility-engine.js";
export default { id: "timestamp", command: "timestamp", category: "Tools", description: "Show Unix timestamp", async execute({ args, reply }) { await runUtility("timestamp", args, reply); } };
