import { runUtility } from "./_utility-engine.js";
export default { id: "jsonformat", command: "jsonformat", category: "Encoding", description: "Pretty-print JSON", async execute({ args, reply }) { await runUtility("jsonformat", args, reply); } };
