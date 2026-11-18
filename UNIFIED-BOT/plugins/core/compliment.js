import { runUtility } from "./_utility-engine.js";
export default { id: "compliment", command: "compliment", category: "Fun", description: "Friendly compliment", async execute({ args, reply }) { await runUtility("compliment", args, reply); } };
