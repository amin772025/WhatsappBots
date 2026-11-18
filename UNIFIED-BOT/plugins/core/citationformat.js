import { runUtility } from "./_utility-engine.js";
export default { id: "citationformat", command: "citationformat", category: "Education", description: "Format basic web citation", async execute({ args, reply }) { await runUtility("citationformat", args, reply); } };
