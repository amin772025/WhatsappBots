import { runUtility } from "./_utility-engine.js";
export default { id: "dateiso", command: "dateiso", category: "Tools", description: "Show ISO date", async execute({ args, reply }) { await runUtility("dateiso", args, reply); } };
