export function userKey(message) {
  const key = String(message?.senderNumber || message?.senderJid || "").trim();
  if (!key) throw new Error("Could not identify this WhatsApp user.");
  return key;
}
export async function updateUser(store, message, updater) {
  const key = userKey(message);
  let result;
  await store.transact(data => {
    data.users ||= {};
    const user = data.users[key] || (data.users[key] = {
      commands: 0, coins: 0, firstSeenAt: new Date().toISOString()
    });
    result = updater(user, key);
    user.lastSeenAt = new Date().toISOString();
  });
  return result;
}
export function getUser(store, message) {
  const key = userKey(message);
  return store.read().users?.[key] || { commands: 0, coins: 0 };
}
