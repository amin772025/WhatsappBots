import { runUtility } from "./_utility-engine.js";
export default { id: "power", command: "power", category: "Math", description: "Exponentiation", async execute({ args, reply }) { await runUtility("power", args, reply); } };
