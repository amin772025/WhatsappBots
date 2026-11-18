export const DEVELOPER = "Amin Saad";
export const CONTACT_USERNAME = "@System.Fail";

const allowedModes = new Set(["public", "private"]);
const allowedLanguages = new Set(["ar", "en"]);

function requiredString(value, key) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Invalid configuration: ${key} must be a non-empty string`);
  }
  return value.trim();
}

function optionalHttpsUrl(value, key) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  let parsed;
  try { parsed = new URL(text); }
  catch { throw new TypeError(`Invalid configuration: ${key} must be a valid HTTPS URL`); }
  if (parsed.protocol !== "https:") {
    throw new TypeError(`Invalid configuration: ${key} must use HTTPS`);
  }
  return parsed.href;
}

export function loadConfig(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError("Settings file is missing. Copy settings.example.js to settings.js and configure it locally.");
  }
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
    channelLink: optionalHttpsUrl(input.channelLink, "channelLink"),
    ownerLink: optionalHttpsUrl(input.ownerLink, "ownerLink"),
    sessionDir: requiredString(input.sessionDir, "sessionDir"),
    dataDir: requiredString(input.dataDir, "dataDir"),
    developer: DEVELOPER,
    contactUsername: CONTACT_USERNAME
  });
}
