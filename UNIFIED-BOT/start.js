import qrcode from "qrcode-terminal";
import { createRuntime } from "./runtime.js";
import { createBaileysProvider } from "./adapters/baileys/provider.js";
import { loadConfig } from "./core/config.js";

const config = loadConfig();
const provider = createBaileysProvider({
  sessionDir: config.sessionDir,
  onQr(qr) {
    console.log("\\nامسح رمز QR من واتساب > الأجهزة المرتبطة:\\n");
    qrcode.generate(qr, { small: true });
  },
  onConnection(update) {
    if (update.connection === "open") console.log("WhatsApp connected.");
    if (update.connection === "close") {
      const code = update.lastDisconnect?.error?.output?.statusCode;
      console.error("WhatsApp connection closed. Code:", code ?? "unknown");
      if (code === provider.loggedOutCode) {
        console.error("Session logged out. Remove the session folder only if you intend to pair again.");
        process.exitCode = 1;
      } else {
        setTimeout(() => provider.connect().catch(console.error), 3000);
      }
    }
  }
});

const runtime = await createRuntime({ config, provider });
provider.onMessage(async message => {
  if (message.text.trim().toLowerCase() === config.prefix + "menu") {
    await provider.sendText(message.chatId, runtime.menu(message.senderNumber));
  }
});

await runtime.start();
console.log(`${config.botName} started. Prefix: ${config.prefix}`);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await runtime.stop();
    process.exit(0);
  });
}
