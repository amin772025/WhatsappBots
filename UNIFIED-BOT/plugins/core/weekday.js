import { runUtility } from "./_utility-engine.js";
export default { id: "weekday", command: "weekday", category: "Tools", description: "Find weekday", async execute({ args, reply }) { await runUtility("weekday", args, reply); } };
