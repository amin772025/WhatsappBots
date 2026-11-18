import { runUtility } from "./_utility-engine.js";
export default { id: "percentage", command: "percentage", category: "Math", description: "Calculate percentage", async execute({ args, reply }) { await runUtility("percentage", args, reply); } };
