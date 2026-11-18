import { runUtility } from "./_utility-engine.js";
export default { id: "average", command: "average", category: "Math", description: "Calculate average", async execute({ args, reply }) { await runUtility("average", args, reply); } };
