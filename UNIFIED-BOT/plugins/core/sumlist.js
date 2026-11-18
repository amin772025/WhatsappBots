import { runUtility } from "./_utility-engine.js";
export default { id: "sumlist", command: "sumlist", category: "Math", description: "Sum numbers", async execute({ args, reply }) { await runUtility("sumlist", args, reply); } };
