import { runUtility } from "./_utility-engine.js";
export default { id: "convertkg", command: "convertkg", category: "Math", description: "Kilograms to pounds", async execute({ args, reply }) { await runUtility("convertkg", args, reply); } };
