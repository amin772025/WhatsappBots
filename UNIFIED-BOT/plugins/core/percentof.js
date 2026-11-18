import { runUtility } from "./_utility-engine.js";
export default { id: "percentof", command: "percentof", category: "Math", description: "Calculate percent of value", async execute({ args, reply }) { await runUtility("percentof", args, reply); } };
