import { runUtility } from "./_utility-engine.js";
export default { id: "charcount", command: "charcount", category: "Text", description: "Count characters", async execute({ args, reply }) { await runUtility("charcount", args, reply); } };
