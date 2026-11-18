import { runUtility } from "./_utility-engine.js";
export default { id: "slugify", command: "slugify", category: "Text", description: "Create a URL slug", async execute({ args, reply }) { await runUtility("slugify", args, reply); } };
