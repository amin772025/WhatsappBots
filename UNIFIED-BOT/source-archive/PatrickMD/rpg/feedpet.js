import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

const HARGA_MAKAN = 1000;

export default {
    command: ['feed', 'feedpet', 'kasihmakan'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m) => {
        const user = getUser(m.sender);

        if (!user.pet) {
            return sendFakeQuoted(denn, m, '❌ Kamu belum punya peliharaan. Ketik `.adoptpet` dulu.');
        }

        if (user.pet.hunger >= 100) {
            return sendFakeQuoted(denn, m, `✅ *${user.pet.name}* sudah kenyang! (Hunger: 100/100)`);
        }

        if ((user.money || 0) < HARGA_MAKAN) {
            return sendFakeQuoted(denn, m, `❌ Uangmu tidak cukup untuk beli makan (Butuh ${formatMoney(HARGA_MAKAN)}).`);
        }

        user.money -= HARGA_MAKAN;
        user.pet.hunger = Math.min(100, user.pet.hunger + 30);
        
        saveDatabase();

        await sendFakeQuoted(denn, m, 
            `🍖 *NYAM NYAM!*\n\n` +
            `*${user.pet.name}* telah makan dengan lahap.\n` +
            `Hunger sekarang: *${user.pet.hunger}/100*`
        );
    }
};