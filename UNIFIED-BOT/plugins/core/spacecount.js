import { runUtility } from "./_utility-engine.js";
export default { id: "spacecount", command: "spacecount", category: "Info", description: "Count spaces", async execute({ args, reply }) { await runUtility("spacecount", args, reply); } };
