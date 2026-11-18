import { runUtility } from "./_utility-engine.js";
export default { id: "urldecode", command: "urldecode", category: "Encoding", description: "URL decode text", async execute({ args, reply }) { await runUtility("urldecode", args, reply); } };
