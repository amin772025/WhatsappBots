import { runUtility } from "./_utility-engine.js";
export default { id: "minmax", command: "minmax", category: "Math", description: "Find minimum and maximum", async execute({ args, reply }) { await runUtility("minmax", args, reply); } };
