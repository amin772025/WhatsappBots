import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

const HARGA_TEBUS = 50000;

export default {
    command: ['tebus', 'bail', 'keluarpenjara'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m) => {
        const user = getUser(m.sender);

        if (!user.jailUntil || user.jailUntil < Date.now()) {
            return sendFakeQuoted(denn, m, '❌ Kamu tidak sedang di penjara.');
        }

        if ((user.money || 0) < HARGA_TEBUS) {
            return sendFakeQuoted(denn, m, 
                `❌ *UANG TIDAK CUKUP*\n\n` +
                `Biaya tebus: *${formatMoney(HARGA_TEBUS)}*\n` +
                `Uangmu: *${formatMoney(user.money || 0)}*\n\n` +
                `_Tunggu masa penjara habis jika tidak punya uang._`
            );
        }

        user.money -= HARGA_TEBUS;
        user.jailUntil = 0;
        saveDatabase();

        await sendFakeQuoted(denn, m, 
            `✅ *BEBAS DENGAN UANG!*\n\n` +
            `Kamu berhasil menyuap polisi sebesar *${formatMoney(HARGA_TEBUS)}*.\n` +
            `Sekarang kamu sudah bebas dan bisa kembali beraktivitas.\n\n` +
            `💳 *Sisa Uangmu:* ${formatMoney(user.money)}`,
            { title: 'Bebas dari Penjara', body: 'Sukses Menyuap' }
        );
    }
};