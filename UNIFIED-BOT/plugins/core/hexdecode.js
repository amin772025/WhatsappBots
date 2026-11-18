import { runUtility } from "./_utility-engine.js";
export default { id: "hexdecode", command: "hexdecode", category: "Encoding", description: "Decode hexadecimal", async execute({ args, reply }) { await runUtility("hexdecode", args, reply); } };
