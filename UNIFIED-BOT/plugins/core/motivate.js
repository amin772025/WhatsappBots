import { runUtility } from "./_utility-engine.js";
export default { id: "motivate", command: "motivate", category: "Fun", description: "Motivational line", async execute({ args, reply }) { await runUtility("motivate", args, reply); } };
