import { randomUUID } from "node:crypto";
export default {
  id: "uuid", command: "uuid", category: "Tools",
  description: "Generate a random UUID",
  async execute({ reply }) { await reply(randomUUID()); }
};
