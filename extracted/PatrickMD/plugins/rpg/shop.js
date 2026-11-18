import { items } from '../../lib/items.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['shop', 'toko'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { prefix }) => {
        let text = `╭───「 *T O K O  C E N T R A L* 」───╮\n\n`;
        
        const categories = {
            tool: { name: '🛠️ Alat & Senjata', items: [] },
            consumable: { name: '🧪 Consumable', items: [] },
            material: { name: '📦 Material', items: [] }
        };

        for (const [id, item] of Object.entries(items)) {
            if (item.buyable === false) continue; 
            let type = item.type || 'material';
            if (type === 'weapon') type = 'tool';
            if (categories[type]) {
                categories[type].items.push({ id, ...item });
            }
        }

        for (const [type, data] of Object.entries(categories)) {
            if (data.items.length === 0) continue;
            
            text += `*${data.name}*\n`;
            for (const item of data.items) {
                text += `│ 🔹 *${item.name}* (\`${item.id}\`)\n`;
                text += `│    💰 Rp ${item.price.toLocaleString('id-ID')}\n`;
                text += `│    📝 _${item.desc}_\n`;
            }
            text += `\n`;
        }

        text += `╰─────────────────\n\n`;
        text += `🛒 *Cara Beli:*\n`;
        text += `\`${prefix}buy <id> <jumlah>\`\n`;
        text += `Contoh: \`${prefix}buy ramuan 2\`\n\n`;
        text += `💼 *Cara Jual:*\n`;
        text += `\`${prefix}sell <id> <jumlah>\`\n`;
        text += `Contoh: \`${prefix}sell ikan_lele 1\``;

        await sendFakeQuoted(denn, m, text, { title: 'Toko Central', body: 'Patrick MD RPG' });
    }
};