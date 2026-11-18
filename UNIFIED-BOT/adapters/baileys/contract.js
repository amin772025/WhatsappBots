// Provider boundary: each Baileys implementation must adapt to this contract.
// No specific fork is selected until event/auth/message compatibility tests pass.
export function assertWhatsAppProvider(provider) {
  const required = ["connect", "disconnect", "sendText", "onMessage"];
  for (const method of required) {
    if (typeof provider?.[method] !== "function") {
      throw new TypeError(`WhatsApp provider must implement ${method}()`);
    }
  }
  return provider;
}
