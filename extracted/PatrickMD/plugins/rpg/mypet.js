import { getUser } from '../../lib/rpg.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

export default {
    command: ['mypet', 'pet'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { prefix }) => {
        const user = getUser(m.sender);

        if (!user.pet) {
            return sendFakeQuoted(denn, m, `❌ Kamu belum punya peliharaan.\n\nKetik \`${prefix}adoptpet\` untuk membeli telur seharga *Rp 15.000*.`);
        }

        const pet = user.pet;
        
        const barLength = 10;
        const filled = Math.round((pet.hunger / 100) * barLength);
        const hungerBar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

        const text = 
            `🐾 *STATUS PELIHARAAN*\n\n` +
            `📛 *Nama:* ${pet.name}\n` +
            `🦊 *Spesies:* ${pet.type} ${pet.emoji}\n` +
            `⭐ *Level:* ${pet.level}\n` +
            `✨ *EXP:* ${pet.exp} / ${pet.level * 100}\n\n` +
            `🍖 *Hunger:* [${hungerBar}] ${pet.hunger}/100\n\n` +
            `_Command:_\n` +
            `• \`${prefix}feed\` — Beri makan (Rp 1.000)\n` +
            `• \`${prefix}hunt\` — Ajak berburu (Cooldown 5m)`;

        await sendFakeQuoted(denn, m, text, { title: 'My Pet', body: 'Status Peliharaan' });
    }
};