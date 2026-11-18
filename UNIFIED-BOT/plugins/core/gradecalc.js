import { runUtility } from "./_utility-engine.js";
export default { id: "gradecalc", command: "gradecalc", category: "Education", description: "Calculate weighted grade", async execute({ args, reply }) { await runUtility("gradecalc", args, reply); } };
