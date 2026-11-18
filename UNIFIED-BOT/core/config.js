import rawConfig, { DEVELOPER, CONTACT_USERNAME } from "../settings.js";

const allowedModes = new Set(["public", "private"]);
const allowedLanguages = new Set(["ar", "en"]);

function requiredString(value, key) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Invalid configuration: ${key} must be a non-empty string`);
  }
  return value.trim();
}

export function loadConfig(input = rawConfig) {
  const ownerNumber = String(input.ownerNumber ?? "").replace(/\D/g, "");
  if (ownerNumber.length < 8 || ownerNumber.length > 15) {
    throw new TypeError("Invalid configuration: ownerNumber must be 8–15 international digits");
  }

  const prefix = requiredString(input.prefix, "prefix");
  if (prefix.length > 4 || /\s/.test(prefix)) {
    throw new TypeError("Invalid configuration: prefix must be 1–4 non-space characters");
  }

  const mode = String(input.mode ?? "public").toLowerCase();
  const language = String(input.language ?? "ar").toLowerCase();
  if (!allowedModes.has(mode)) throw new TypeError("Invalid configuration: mode must be public or private");
  if (!allowedLanguages.has(language)) throw new TypeError("Invalid configuration: language must be ar or en");

  return Object.freeze({
    botName: requiredString(input.botName, "botName"),
    ownerName: requiredString(input.ownerName, "ownerName"),
    ownerNumber,
    prefix,
    language,
    mode,
    packname: requiredString(input.packname, "packname"),
    author: requiredString(input.author, "author"),
    channelName: String(input.channelName ?? ""),
    channelLink: String(input.channelLink ?? ""),
    ownerLink: String(input.ownerLink ?? ""),
    sessionDir: requiredString(input.sessionDir, "sessionDir"),
    dataDir: requiredString(input.dataDir, "dataDir"),
    developer: DEVELOPER,
    contactUsername: CONTACT_USERNAME
  });
}
