import { runUtility } from "./_utility-engine.js";
export default { id: "adddays", command: "adddays", category: "Tools", description: "Add days to date", async execute({ args, reply }) { await runUtility("adddays", args, reply); } };
