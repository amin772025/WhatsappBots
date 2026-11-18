import { runUtility } from "./_utility-engine.js";
export default { id: "primecheck", command: "primecheck", category: "Math", description: "Check prime number", async execute({ args, reply }) { await runUtility("primecheck", args, reply); } };
