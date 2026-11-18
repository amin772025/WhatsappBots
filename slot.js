// slotmachine.js
// ᴍᴏᴅᴇ ʙʏ : https://t.me/YatoCoding
// Features: 3 Reels Design, Spin Animation, Bet adjustment, Credit/Jackpot System, Sound
// ESM Plugin for YATO BOT MD

const html = `
<style>
:root {
  --bg-dark: #0a1712;
  --panel-bg: #11271f;
  --accent-gold: #e5c158;
  --gold-glow: #ffd700;
  --btn-green: #25a266;
  --btn-dark-green: #145937;
  --border-gold: #c29d38;
  --card-bg: #fdfbf7;
  --text-light: #e9edef;
  --shadow: 0 18px 50px rgba(0,0,0,.6);
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { min-height: 100vh; background: transparent; color: var(--text-light); font-family: var(--font); user-select: none; }

.stage { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 12px 8px; }
.card {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(180deg, #183c2e 0%, #0d221a 100%);
  border: 3px solid var(--border-gold);
  border-radius: 24px;
  padding: 16px;
  box-shadow: var(--shadow);
  text-align: center;
  position: relative;
}

/* Header & Banner */
.banner {
  border: 2px solid var(--border-gold);
  border-radius: 14px;
  background: linear-gradient(180deg, #132e23 0%, #0a1b14 100%);
  padding: 8px 4px;
  margin-bottom: 10px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
}

.title {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: var(--accent-gold);
  text-shadow: 0 0 8px rgba(229,193,88,0.5);
}

.jackpot {
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-gold);
  margin-top: 3px;
  letter-spacing: 1px;
}

/* Stats Row */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: #09140f;
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  padding: 6px;
  margin-bottom: 12px;
}

.stat-box { text-align: center; }
.stat-lbl { font-size: 9px; color: #7f9f91; font-weight: 700; text-transform: uppercase; }
.stat-val { font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px; }

/* Slot Machine Grid - 3 Reels */
.slot-container {
  background: #08110d;
  border: 2px solid var(--border-gold);
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 12px;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.9);
}

.reels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: var(--border-gold);
  padding: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.reel {
  background: linear-gradient(180deg, #f7f3e8 0%, #ffffff 50%, #f7f3e8 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 170px;
  justify-content: space-around;
  align-items: center;
}

.symbol {
  font-size: 32px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

/* Spin Info Bar */
.info-bar {
  background: #09140f;
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  padding: 6px;
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-gold);
  margin-bottom: 12px;
  letter-spacing: 1px;
}

/* Control Buttons */
.controls {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}

.btn {
  border: 2px solid var(--border-gold);
  border-radius: 14px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
  cursor: pointer;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: transform 0.1s ease;
}

.btn:active { transform: scale(0.94); }

.btn-bet {
  background: linear-gradient(180deg, #1b6342 0%, #0d3824 100%);
}

.btn-spin {
  background: linear-gradient(180deg, #32c77d 0%, #166e43 100%);
  color: #ffffff;
  font-size: 18px;
  letter-spacing: 1px;
}

.footer {
  margin-top: 10px;
  font-size: 10px;
  color: #7f9f91;
}
</style>

<main class="stage">
  <div class="card">

    <div class="banner">
      <div class="title">FRUIT BONANZA</div>
      <div class="jackpot">JACKPOT · 10,000 CREDITS</div>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-lbl">CREDITS</div>
        <div class="stat-val" id="credits">500</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">BET</div>
        <div class="stat-val" id="bet">10</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">BEST WIN</div>
        <div class="stat-val" id="bestWin">0</div>
      </div>
    </div>

    <div class="slot-container">
      <div class="reels">
        <div class="reel" id="r0"><span class="symbol">🍋</span><span class="symbol">🍒</span><span class="symbol">💎</span></div>
        <div class="reel" id="r1"><span class="symbol">🍒</span><span class="symbol">🔔</span><span class="symbol">7️⃣</span></div>
        <div class="reel" id="r2"><span class="symbol">💎</span><span class="symbol">🍒</span><span class="symbol">🔔</span></div>
      </div>
    </div>

    <div class="info-bar" id="infoBar">SPIN TO PLAY</div>

    <div class="controls">
      <button class="btn btn-bet" id="betBtn">BET +</button>
      <button class="btn btn-spin" id="spinBtn">SPIN</button>
    </div>

    <div class="footer">YATO BOT MD — Fruit Bonanza Slot Engine</div>
  </div>
</main>

<script>
(() => {
  const symbols = ['🍋', '🍒', '💎', '🔔', '7️⃣', '🍇', '🍉'];
  
  let credits = 500;
  let bet = 10;
  let bestWin = 0;
  let isSpinning = false;

  const creditsEl = document.getElementById('credits');
  const betEl = document.getElementById('bet');
  const bestWinEl = document.getElementById('bestWin');
  const infoBar = document.getElementById('infoBar');
  const spinBtn = document.getElementById('spinBtn');
  const betBtn = document.getElementById('betBtn');

  function playAudio(freq, duration = 0.1) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }

  function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function updateReels() {
    let grid = [];
    for(let i=0; i<3; i++) {
      let col = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      grid.push(col);
      const reelEl = document.getElementById('r' + i);
      reelEl.innerHTML = \`<span class="symbol">\${col[0]}</span><span class="symbol">\${col[1]}</span><span class="symbol">\${col[2]}</span>\`;
    }
    return grid;
  }

  betBtn.onclick = () => {
    if (isSpinning) return;
    playAudio(400);
    if (bet === 10) bet = 20;
    else if (bet === 20) bet = 50;
    else if (bet === 50) bet = 100;
    else bet = 10;
    betEl.textContent = bet;
  };

  spinBtn.onclick = () => {
    if (isSpinning) return;
    if (credits < bet) {
      infoBar.textContent = '❌ NOT ENOUGH CREDITS!';
      playAudio(150, 0.3);
      return;
    }

    credits -= bet;
    creditsEl.textContent = credits;
    isSpinning = true;
    infoBar.textContent = 'SPINNING...';
    playAudio(600, 0.15);

    let spins = 0;
    const interval = setInterval(() => {
      updateReels();
      playAudio(300 + spins * 25, 0.05);
      spins++;

      if (spins > 10) {
        clearInterval(interval);
        isSpinning = false;
        const finalGrid = updateReels();
        checkWin(finalGrid);
      }
    }, 100);
  };

  function checkWin(grid) {
    // فحص الصف الأوسط
    const midRow = [grid[0][1], grid[1][1], grid[2][1]];
    
    let isThreeMatch = (midRow[0] === midRow[1] && midRow[1] === midRow[2]);
    let isTwoMatch = (midRow[0] === midRow[1] || midRow[1] === midRow[2] || midRow[0] === midRow[2]);

    let winAmount = 0;
    if (isThreeMatch) {
      if (midRow[0] === '7️⃣' || midRow[0] === '💎') {
        winAmount = bet * 20; // بالجائزة الكبرى
      } else {
        winAmount = bet * 10;
      }
    } else if (isTwoMatch) {
      winAmount = bet * 2;
    }

    if (winAmount > 0) {
      credits += winAmount;
      creditsEl.textContent = credits;
      if (winAmount > bestWin) {
        bestWin = winAmount;
        bestWinEl.textContent = bestWin;
      }
      infoBar.textContent = \`🎉 WIN! +\${winAmount} CREDITS\`;
      playAudio(800, 0.4);
    } else {
      infoBar.textContent = 'TRY AGAIN!';
    }
  }
})();
</script>
`;
// ᴍᴏᴅᴇ ʙʏ : https://t.me/YatoCoding
const handler = async (m, { conn }) => {
  try {
    await conn.relayMessage(
      m.chat,
      {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, botMetadata: {} },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: 'Fruit Bonanza Slot Machine 🎰' }],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: 'yato-fruitbonanza-rich-html',
                    sections: [{
                      view_model: {
                        primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload: html, trusted_sources: [] },
                        __typename: 'GenAISingleLayoutViewModel'
                      }
                    }]
                  })
                ).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1, isForwarded: true,
                forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4
              }
            }
          }
        }
      },
      {}
    );
  } catch (e) {
    console.error('[SLOT MACHINE ERROR]', e);
    await m.reply('❌ فشل إرسال واجهة لعبة الفواكه.');
  }
};

handler.help = ['فواكه', 'مراهنة', 'slot'];
handler.tags = ['game'];
handler.command = ['فواكه', 'فواكه', 'مراهنة', 'slot', 'fruitbonanza'];

export default handler;