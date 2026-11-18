import { runUtility } from "./_utility-engine.js";
export default { id: "gpahelper", command: "gpahelper", category: "Education", description: "Calculate average grade", async execute({ args, reply }) { await runUtility("gpahelper", args, reply); } };
