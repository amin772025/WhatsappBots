import { runUtility } from "./_utility-engine.js";
export default { id: "converttemp", command: "converttemp", category: "Math", description: "Temperature conversion", async execute({ args, reply }) { await runUtility("converttemp", args, reply); } };
