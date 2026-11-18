import { runUtility } from "./_utility-engine.js";
export default { id: "randomnumber", command: "randomnumber", category: "Tools", description: "Generate a random number", async execute({ args, reply }) { await runUtility("randomnumber", args, reply); } };
