import { runUtility } from "./_utility-engine.js";
export default { id: "convertbytes", command: "convertbytes", category: "Math", description: "Readable byte units", async execute({ args, reply }) { await runUtility("convertbytes", args, reply); } };
