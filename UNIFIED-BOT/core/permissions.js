const digits = value => String(value ?? "").replace(/\D/g, "");

export function createPermissionService(config) {
  const owner = digits(config.ownerNumber);
  if (!owner) throw new TypeError("A valid configured owner number is required");

  function isOwner(message) {
    // Do not trust fromMe alone: forwarded/quoted messages can carry that flag.
    return digits(message?.senderNumber) === owner;
  }

  function isGroupAdmin(message) {
    return Boolean(message?.isGroup && message?.senderIsAdmin);
  }

  function canUseBot(message) {
    return config.mode === "public" || isOwner(message);
  }

  function canUseAdminCommand(message) {
    return isOwner(message) || isGroupAdmin(message);
  }

  return Object.freeze({ isOwner, isGroupAdmin, canUseBot, canUseAdminCommand });
}
