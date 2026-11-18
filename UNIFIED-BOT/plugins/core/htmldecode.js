import { runUtility } from "./_utility-engine.js";
export default { id: "htmldecode", command: "htmldecode", category: "Encoding", description: "Decode basic HTML entities", async execute({ args, reply }) { await runUtility("htmldecode", args, reply); } };
