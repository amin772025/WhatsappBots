import { runUtility } from "./_utility-engine.js";
export default { id: "urlencode", command: "urlencode", category: "Encoding", description: "URL encode text", async execute({ args, reply }) { await runUtility("urlencode", args, reply); } };
