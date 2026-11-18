import { getUser, formatMoney } from '../../lib/rpg.js';
import { saveDatabase } from '../../lib/database.js';
import { sendFakeQuoted } from '../../lib/fakequoted.js';

const HARGA_TELUR = 15000;

const PET_TYPES = [
    { type: 'Kucing', emoji: '🐱' },
    { type: 'Anjing', emoji: '🐶' },
    { type: 'Naga', emoji: '🐉' },
    { type: 'Rubah', emoji: '🦊' },
    { type: 'Serigala', emoji: '🐺' },
    { type: 'Elang', emoji: '🦅' }
];

export default {
    command: ['adoptpet', 'belipet', 'adopt'],
    category: 'rpg',
    groupOnly: true,
    execute: async (denn, m, { prefix }) => {
        const user = getUser(m.sender);

        if (user.pet) {
            return sendFakeQuoted(denn, m, `❌ Kamu sudah punya peliharaan *${user.pet.name}* (${user.pet.type}).\n_Rawat dia baik-baik ya!_`);
        }

        if ((user.money || 0) < HARGA_TELUR) {
            return sendFakeQuoted(denn, m, `❌ Uangmu tidak cukup!\n\nHarga telur: *${formatMoney(HARGA_TELUR)}*\nUangmu: *${formatMoney(user.money || 0)}*`);
        }

        user.money -= HARGA_TELUR;
        
        const randomPet = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
        const petName = `Pet_${m.sender.split('@')[0].slice(-4)}`;
        
        user.pet = {
            name: petName,
            type: randomPet.type,
            emoji: randomPet.emoji,
            level: 1,
            exp: 0,
            hunger: 100,
            lastHunt: 0
        };

        saveDatabase();

        const text = 
            `🎉 *TELUR MENETAS!*\n\n` +
            `Kamu baru saja mengadopsi seekor *${randomPet.type}* ${randomPet.emoji}!\n\n` +
            `📛 *Nama:* ${petName}\n` +
            `⭐ *Level:* 1\n` +
            `🍖 *Hunger:* 100/100\n\n` +
            `_Gunakan \`${prefix}mypet\` untuk melihat statusnya._\n` +
            `_Jangan lupa beri makan dengan \`${prefix}feed\`!_`;

        await sendFakeQuoted(denn, m, text, { title: 'Adopsi Pet', body: 'Telur menetas!' });
    }
};