import qrcode from "qrcode-terminal";
import { createRuntime } from "./runtime.js";
import { loadConfig } from "./core/config.js";
import { createBaileysProvider } from "./adapters/baileys/provider.js";

let settings;
try {
  settings = (await import("./settings.js")).default;
} catch {
  throw new Error("Missing settings.js. Copy settings.example.js to settings.js, configure ownerNumber, then run again.");
}
const config = loadConfig(settings);
let shuttingDown = false;
const provider = createBaileysProvider({
  sessionDir: config.sessionDir,
  onQr(qr) {
    console.log("\nامسح رمز QR من واتساب > الأجهزة المرتبطة:\n");
    qrcode.generate(qr, { small: true });
  },
  onConnection(update) {
    if (update.connection === "open") console.log("WhatsApp connected.");
    if (update.connection === "close" && !shuttingDown) {
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

await runtime.start();
console.log(`${runtime.config.botName} started. Prefix: ${runtime.config.prefix}`);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    shuttingDown = true;
    await runtime.stop();
    process.exit(0);
  });
}
