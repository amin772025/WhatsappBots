import { runUtility } from "./_utility-engine.js";
export default { id: "median", command: "median", category: "Math", description: "Calculate median", async execute({ args, reply }) { await runUtility("median", args, reply); } };
