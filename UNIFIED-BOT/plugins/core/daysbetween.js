import { runUtility } from "./_utility-engine.js";
export default { id: "daysbetween", command: "daysbetween", category: "Tools", description: "Days between two dates", async execute({ args, reply }) { await runUtility("daysbetween", args, reply); } };
