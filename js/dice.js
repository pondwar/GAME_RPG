// dice.js - D&D and Tormenta D20 Roll System
class DiceSystem {
  constructor() {
    this.polyEl = document.getElementById('d20-poly');
    this.valEl = document.getElementById('d20-val');
    this.reasonEl = document.getElementById('dice-reason');
    this.calcEl = document.getElementById('dice-calc');
    this.verdictEl = document.getElementById('dice-verdict');
    this.isRolling = false;

    // Attributes (Tormenta20 / D&D style)
    this.stats = {
      forca: 2,         // Força (+2)
      destreza: 3,      // Destreza (+3)
      constituicao: 2,  // Constituição (+2)
      inteligencia: 1,  // Inteligência (+1)
      sabedoria: 2,     // Sabedoria / Percepção (+2)
      sobrevivencia: 4  // Sobrevivência (+4)
    };
  }

  // Roll D20 with animation and callbacks
  rollD20(reason = 'Teste de Sorte', mod = 0, dc = 10, callback = null) {
    // ja rolando: entra na fila (antes a rolagem era descartada em silencio e a acao sumia);
    // o mesmo teste repetido (tecla apertada duas vezes) nao empilha
    if (this.isRolling) {
      this.queue = this.queue || [];
      if (this.queue.length < 3 && !this.queue.some(q => q[0] === reason) && this.reasonEl.innerText !== reason) this.queue.push([reason, mod, dc, callback]);
      return;
    }
    this.isRolling = true;

    if (window.sounds) window.sounds.playDiceRoll();

    // Trigger visual roll animation
    this.polyEl.classList.remove('rolling');
    void this.polyEl.offsetWidth; // trigger reflow
    this.polyEl.classList.add('rolling');

    this.reasonEl.innerText = reason;
    this.verdictEl.innerText = 'Rolando os dados...';
    this.verdictEl.className = 'dice-verdict';

    // Rapid number shuffle effect
    let count = 0;
    const interval = setInterval(() => {
      this.valEl.innerText = Math.floor(Math.random() * 20) + 1;
      count++;
      if (count > 8) {
        clearInterval(interval);
        this.finalizeRoll(reason, mod, dc, callback);
      }
    }, 60);
  }

  finalizeRoll(reason, mod, dc, callback) {
    const rawRoll = Math.floor(Math.random() * 20) + 1;
    this.valEl.innerText = rawRoll;
    this.isRolling = false;

    const total = rawRoll + mod;
    const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
    this.calcEl.innerText = `D20: ${rawRoll} (${modStr}) = ${total}`;

    let isSuccess = false;
    let isCrit = false;
    let isFumble = false;

    if (rawRoll === 20) {
      isCrit = true;
      isSuccess = true;
      this.verdictEl.innerText = '★ SUCESSO CRÍTICO! ★';
      this.verdictEl.className = 'dice-verdict crit-success';
      if (window.sounds) window.sounds.playCritSuccess();
      window.game.addLog(`🎲 [D20 - ${reason}] 20 NATURAL! SUCESSO CRÍTICO ABSOLUTO!`, 'dice');
    } else if (rawRoll === 1) {
      isFumble = true;
      isSuccess = false;
      this.verdictEl.innerText = '☠ FALHA CRÍTICA! ☠';
      this.verdictEl.className = 'dice-verdict crit-fail';
      if (window.sounds) window.sounds.playCritFail();
      window.game.addLog(`🎲 [D20 - ${reason}] 1 NATURAL! Falha Crítica desastrosa!`, 'warning');
    } else if (total >= dc) {
      isSuccess = true;
      this.verdictEl.innerText = `Sucesso! (CD ${dc})`;
      this.verdictEl.className = 'dice-verdict';
      window.game.addLog(`🎲 [D20 - ${reason}] Rolou ${rawRoll} + ${mod} = ${total} vs CD ${dc} (Sucesso!)`, 'dice');
    } else {
      isSuccess = false;
      this.verdictEl.innerText = `Falhou por pouco... (CD ${dc})`;
      this.verdictEl.className = 'dice-verdict';
      window.game.addLog(`🎲 [D20 - ${reason}] Rolou ${rawRoll} + ${mod} = ${total} vs CD ${dc} (Falha)`, 'warning');
    }

    if (callback) {
      try { callback({ rawRoll, total, isSuccess, isCrit, isFumble, dc }); }
      catch (e) { console.error('[Dados] erro na acao do teste:', e); }
    }
    // proximo da fila (depois de um respiro para o jogador ler o resultado)
    if (this.queue && this.queue.length) { const q = this.queue.shift(); setTimeout(() => this.rollD20(...q), 350); }
  }
}

window.diceSystem = new DiceSystem();
