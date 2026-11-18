import { runUtility } from "./_utility-engine.js";
export default { id: "gcd", command: "gcd", category: "Math", description: "Greatest common divisor", async execute({ args, reply }) { await runUtility("gcd", args, reply); } };
