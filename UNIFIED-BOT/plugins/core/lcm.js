import { runUtility } from "./_utility-engine.js";
export default { id: "lcm", command: "lcm", category: "Math", description: "Least common multiple", async execute({ args, reply }) { await runUtility("lcm", args, reply); } };
