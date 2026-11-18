import { runUtility } from "./_utility-engine.js";
export default { id: "caesar", command: "caesar", category: "Encoding", description: "Apply Caesar shift", async execute({ args, reply }) { await runUtility("caesar", args, reply); } };
