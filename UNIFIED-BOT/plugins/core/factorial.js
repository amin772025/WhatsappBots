import { runUtility } from "./_utility-engine.js";
export default { id: "factorial", command: "factorial", category: "Math", description: "Calculate factorial", async execute({ args, reply }) { await runUtility("factorial", args, reply); } };
