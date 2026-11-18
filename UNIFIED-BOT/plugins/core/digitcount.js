import { runUtility } from "./_utility-engine.js";
export default { id: "digitcount", command: "digitcount", category: "Info", description: "Count digits", async execute({ args, reply }) { await runUtility("digitcount", args, reply); } };
