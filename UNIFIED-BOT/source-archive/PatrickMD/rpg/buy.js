import { getUser, formatMoney } from '../../lib/rpg.js';
import { items } from '../../lib/items.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['buy', 'beli'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { args, prefix }) => {
        if (!args[0]) {
            return sendFakeQuoted(denn, m, `❌ *FORMAT SALAH*\n\nGunakan: \`${prefix}buy <id> <jumlah>\`\nContoh: \`${prefix}buy ramuan 2\`\n\n_Lihat daftar barang di \`${prefix}shop\`_`);
        }

        const itemId = args[0].toLowerCase();
        const qty = parseInt(args[1] || '1');

        if (!items[itemId]) {
            return sendFakeQuoted(denn, m, `❌ Barang dengan ID *${itemId}* tidak ditemukan.\nCek \`${prefix}shop\` untuk melihat daftar barang.`);
        }

        const item = items[itemId];

        if (item.buyable === false) {
            return sendFakeQuoted(denn, m, `❌ *${item.name}* tidak dijual di toko.\nBarang ini hanya bisa didapatkan dari aktivitas (mancing, dll).`);
        }

        if (isNaN(qty) || qty <= 0) {
            return sendFakeQuoted(denn, m, `❌ Jumlah tidak valid. Masukkan angka lebih dari 0.`);
        }

        const user = getUser(m.sender);
        const totalHarga = item.price * qty;

        if ((user.money || 0) < totalHarga) {
            return sendFakeQuoted(denn, m, `❌ *UANG TIDAK CUKUP*\n\n💰 Total Harga: *${formatMoney(totalHarga)}*\n💳 Uangmu: *${formatMoney(user.money || 0)}*`);
        }
        
        user.money -= totalHarga;
        if (!user.inventory) user.inventory = {};
        user.inventory[itemId] = (user.inventory[itemId] || 0) + qty;
        saveDatabase();

        await sendFakeQuoted(denn, m, 
            `✅ *BERHASIL MEMBELI*\n\n` +
            `📦 Barang: *${item.name}* (${qty}x)\n` +
            `💰 Total: *${formatMoney(totalHarga)}*\n` +
            `💳 Sisa Uang: *${formatMoney(user.money)}*\n\n` +
            `_Cek tasmu dengan \`${prefix}inv\`_`,
            { title: 'Struk Pembelian', body: 'Transaksi Sukses' }
        );
    }
};