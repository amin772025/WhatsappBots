import { runUtility } from "./_utility-engine.js";
export default { id: "roundnum", command: "roundnum", category: "Math", description: "Round decimal", async execute({ args, reply }) { await runUtility("roundnum", args, reply); } };
