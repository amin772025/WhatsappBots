import { runUtility } from "./_utility-engine.js";
export default { id: "convertcm", command: "convertcm", category: "Math", description: "Centimeters to inches", async execute({ args, reply }) { await runUtility("convertcm", args, reply); } };
