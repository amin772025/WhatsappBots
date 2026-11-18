import { runUtility } from "./_utility-engine.js";
export default { id: "tonguetwister", command: "tonguetwister", category: "Fun", description: "Tongue twister", async execute({ args, reply }) { await runUtility("tonguetwister", args, reply); } };
