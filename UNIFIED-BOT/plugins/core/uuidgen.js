import { runUtility } from "./_utility-engine.js";
export default { id: "uuidgen", command: "uuidgen", category: "Tools", description: "Generate UUID", async execute({ args, reply }) { await runUtility("uuidgen", args, reply); } };
