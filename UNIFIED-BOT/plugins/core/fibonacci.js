import { runUtility } from "./_utility-engine.js";
export default { id: "fibonacci", command: "fibonacci", category: "Math", description: "Generate Fibonacci sequence", async execute({ args, reply }) { await runUtility("fibonacci", args, reply); } };
