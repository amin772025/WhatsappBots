import { runUtility } from "./_utility-engine.js";
export default { id: "randomchoice", command: "randomchoice", category: "Tools", description: "Choose from options", async execute({ args, reply }) { await runUtility("randomchoice", args, reply); } };
