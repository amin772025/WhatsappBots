import { getUser, formatMoney } from '../../lib/rpg.js';
import { items } from '../../lib/items.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['sell', 'jual'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { args, prefix }) => {
        const user = getUser(m.sender);
        const inv = user.inventory || {};

        if (!args[0]) {
            let sellableText = '';
            let hasItem = false;
            for (const [id, qty] of Object.entries(inv)) {
                if (qty > 0 && items[id]) {
                    hasItem = true;
                    const hargaJual = Math.floor(items[id].price * 0.7);
                    sellableText += `│ • *${items[id].name}* (${qty}x)\n│   💰 Harga jual: ${formatMoney(hargaJual)}/pcs\n`;
                }
            }

            if (!hasItem) {
                return sendFakeQuoted(denn, m, `🎒 Tas kamu kosong, tidak ada yang bisa dijual.`);
            }

            return sendFakeQuoted(denn, m, 
                `╭───「 *D A F T A R  J U A L* 」───╮\n\n` +
                `${sellableText}\n` +
                `╰─────────────────\n\n` +
                `Gunakan: \`${prefix}sell <id> <jumlah>\`\n` +
                `Contoh: \`${prefix}sell ikan_lele 2\`\n\n` +
                `_Harga jual = 70% dari harga asli._`
            );
        }

        const itemId = args[0].toLowerCase();
        const qty = parseInt(args[1] || '1');

        if (!items[itemId] || !inv[itemId]) {
            return sendFakeQuoted(denn, m, `❌ Kamu tidak punya *${itemId}* di tas.`);
        }

        if (isNaN(qty) || qty <= 0) {
            return sendFakeQuoted(denn, m, `❌ Jumlah tidak valid.`);
        }

        if (inv[itemId] < qty) {
            return sendFakeQuoted(denn, m, `❌ Kamu hanya punya *${inv[itemId]}x* ${items[itemId].name}.`);
        }

        const hargaJual = Math.floor(items[itemId].price * 0.7);
        const totalDapat = hargaJual * qty;

        inv[itemId] -= qty;
        if (inv[itemId] <= 0) delete inv[itemId];
        
        user.money = (user.money || 0) + totalDapat;
        saveDatabase();

        await sendFakeQuoted(denn, m, 
            `✅ *BERHASIL MENJUAL*\n\n` +
            `📦 Barang: *${items[itemId].name}* (${qty}x)\n` +
            `💰 Dapat: *${formatMoney(totalDapat)}*\n` +
            `💳 Total Uang: *${formatMoney(user.money)}*\n\n` +
            `_Cek profilmu dengan \`${prefix}profile\`_`,
            { title: 'Struk Penjualan', body: 'Transaksi Sukses' }
        );
    }
};