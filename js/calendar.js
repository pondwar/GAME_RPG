// calendar.js - Real-time 24h Solar Cycle, Moon Phases, Seasons & Dynamic Weather
class WorldTimeSystem {
  constructor(game) {
    this.game = game;

    // Time Mode: Real-time 24h by default, but can be accelerated for testing
    this.timeScale = 1.0; // 1 second = 1 second real-time
    this.virtualDate = new Date();

    // Weather State
    this.weather = 'clear'; // 'clear', 'overcast', 'light_rain', 'thunderstorm'
    this.weatherTimer = 0;
    this.rainDrops = [];
    this.maxRainDrops = 180;
    this.lightningFlash = 0; // 0 to 1 intensity
    this.thunderDelay = 0;

    // Moon phase names and icons
    this.moonPhases = [
      { name: 'Lua Nova', icon: '🌑', light: 0.12 },
      { name: 'Lua Crescente', icon: '🌒', light: 0.22 },
      { name: 'Quarto Crescente', icon: '🌓', light: 0.35 },
      { name: 'Gibosa Crescente', icon: '🌔', light: 0.48 },
      { name: 'Lua Cheia', icon: '🌕', light: 0.65 },
      { name: 'Gibosa Minguante', icon: '🌖', light: 0.48 },
      { name: 'Quarto Minguante', icon: '🌗', light: 0.35 },
      { name: 'Lua Minguante', icon: '🌘', light: 0.22 }
    ];

    // Initialize rain drops pool
    for (let i = 0; i < this.maxRainDrops; i++) {
      this.rainDrops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: Math.random() * 18 + 12,
        speed: Math.random() * 450 + 650,
        splash: 0
      });
    }

    this.initWeather();
  }

  // Calculate Moon Phase based on astronomical Julian Day approximation
  getMoonPhase(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0, e = 0, jd = 0, b = 0;
    if (month < 3) {
      c = year - 1;
      e = 0;
    } else {
      c = year;
      e = 12;
    }
    jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (month + e + 1)) + day - 1524.5;
    b = (jd - 2451549.5) / 29.53058867;
    const phaseIndex = Math.floor((b - Math.floor(b)) * 8 + 0.5) % 8;
    return this.moonPhases[phaseIndex];
  }

  // Season based on Southern Hemisphere real calendar
  getSeason(date) {
    const month = date.getMonth(); // 0 to 11
    const day = date.getDate();

    // Brazil / South Hemisphere Seasons:
    // Primavera: 22 Sep - 21 Dec
    // Verão: 21 Dec - 20 Mar
    // Outono: 20 Mar - 21 Jun
    // Inverno: 21 Jun - 22 Sep
    const dayOfYear = (month * 30.5) + day;
    if (dayOfYear >= 82 && dayOfYear < 174) return { name: 'Outono', icon: '🍂', desc: 'Noites frescas e folhas secas' };
    if (dayOfYear >= 174 && dayOfYear < 265) return { name: 'Inverno', icon: '❄️', desc: 'Frio e dias mais curtos' };
    if (dayOfYear >= 265 && dayOfYear < 355) return { name: 'Primavera', icon: '🌸', desc: 'Florescimento, brotos e chuvas amenas' };
    return { name: 'Verão', icon: '☀️', desc: 'Dias longos, calor e tempestades tropicais' };
  }

  initWeather() {
    // Pick initial weather based on current season
    const season = this.getSeason(this.virtualDate);
    const rand = Math.random();
    if (season.name === 'Primavera') {
      // 40% chance of rain in spring
      this.weather = rand < 0.35 ? 'light_rain' : (rand < 0.45 ? 'overcast' : 'clear');
    } else {
      this.weather = rand < 0.25 ? 'light_rain' : 'clear';
    }
    this.weatherTimer = Math.random() * 240 + 180; // 3 to 7 minutes
  }

  update(dt) {
    // Advance virtual date according to timeScale
    const millisToAdd = dt * 1000 * this.timeScale;
    this.virtualDate = new Date(this.virtualDate.getTime() + millisToAdd);

    // Weather cycles
    this.weatherTimer -= dt;
    if (this.weatherTimer <= 0) {
      this.cycleWeather();
    }

    // Update Rain Drops
    if (this.weather === 'light_rain' || this.weather === 'thunderstorm') {
      const dropSpeedFactor = this.weather === 'thunderstorm' ? 1.3 : 1.0;
      for (const drop of this.rainDrops) {
        drop.y += drop.speed * dropSpeedFactor * dt;
        drop.x -= 120 * dt; // slant with wind
        if (drop.y > window.innerHeight) {
          drop.y = -20;
          drop.x = Math.random() * (window.innerWidth + 200);
          drop.splash = 0.08; // trigger splash ripple
        }
      }

      // Ecological impact: Rain speeds up tree fruit growth!
      if (this.game && this.game.trees) {
        for (const t of this.game.trees) {
          t.growthTimer += dt * 1.5; // fruits grow 2.5x faster in rain!
        }
      }
    }

    // Thunderstorm logic: Random lightning flashes and rumbles
    if (this.weather === 'thunderstorm') {
      if (Math.random() < 0.004) {
        this.triggerLightning();
      }
    }

    // Decay lightning flash
    if (this.lightningFlash > 0) {
      this.lightningFlash = Math.max(0, this.lightningFlash - dt * 4.5);
    }

    // Delayed Thunder sound after lightning
    if (this.thunderDelay > 0) {
      this.thunderDelay -= dt;
      if (this.thunderDelay <= 0) {
        if (window.sounds) window.sounds.playThunder();
        if (this.game) this.game.addLog(`⚡ Um estrondo de trovão ecoa pela floresta!`, 'warning');
      }
    }
  }

  cycleWeather() {
    const season = this.getSeason(this.virtualDate);
    const rand = Math.random();

    if (this.weather === 'clear') {
      this.weather = rand < 0.5 ? 'overcast' : (rand < 0.8 ? 'light_rain' : 'clear');
    } else if (this.weather === 'overcast') {
      this.weather = rand < 0.6 ? 'light_rain' : (rand < 0.8 ? 'thunderstorm' : 'clear');
    } else if (this.weather === 'light_rain') {
      this.weather = rand < 0.4 ? 'thunderstorm' : (rand < 0.8 ? 'overcast' : 'clear');
    } else {
      this.weather = 'light_rain';
    }

    this.weatherTimer = Math.random() * 300 + 120; // 2 to 7 minutes

    if (this.game) {
      let msg = 'O céu clareou sob os raios de sol.';
      if (this.weather === 'light_rain') msg = '🌧 Uma chuva fina e refrescante começa a regar a floresta!';
      if (this.weather === 'thunderstorm') msg = '⛈ Nuvens carregadas trazem uma tempestade com relâmpagos e trovões!';
      if (this.weather === 'overcast') msg = 'Nuvens cinzentas cobrem o sol.';
      this.game.addLog(`[Clima] ${msg}`, 'system');
    }
  }

  triggerLightning() {
    this.lightningFlash = 0.95;
    this.thunderDelay = 0.4 + Math.random() * 0.8; // thunder heard a moment after flash
  }

  // Calculate ambient sky light & darkness color
  // Returns { r, g, b, alpha } for overlay tinting
  getAmbientLight() {
    const px = (this.game && this.game.player) ? this.game.player.x : 0;
    const localDate = (this.game && this.game.world)
      ? this.game.world.getLocalSolarTime(this.virtualDate, px)
      : this.virtualDate;

    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const timeDec = hours + minutes / 60; // 0.0 to 24.0

    const moon = this.getMoonPhase(localDate);

    // Default daylight: clear alpha 0.0
    let r = 0, g = 0, b = 0, alpha = 0.0;

    // 00:00 - 05:00: Deep Night (Moonlit dark blue/purple)
    if (timeDec < 5.0) {
      r = 8; g = 12; b = 28;
      // Moon fullness reduces darkness!
      alpha = 0.84 - (moon.light * 0.28);
    }
    // 05:00 - 06:30: Dawn / Sunrise (Cold blue transitioning to golden orange)
    else if (timeDec >= 5.0 && timeDec < 6.5) {
      const prog = (timeDec - 5.0) / 1.5;
      r = Math.round(8 + (240 - 8) * prog);
      g = Math.round(12 + (150 - 12) * prog);
      b = Math.round(28 + (80 - 28) * prog);
      alpha = 0.70 * (1 - prog);
    }
    // 06:30 - 11:30: Morning Sun (Warm daylight)
    else if (timeDec >= 6.5 && timeDec < 11.5) {
      alpha = 0.0; // full bright day
    }
    // 11:30 - 16:30: Midday Clear (Pure sunlight)
    else if (timeDec >= 11.5 && timeDec < 16.5) {
      alpha = 0.0;
    }
    // 16:30 - 18:30: Golden Hour / Sunset (Vibrant amber and crimson twilight)
    else if (timeDec >= 16.5 && timeDec < 18.5) {
      const prog = (timeDec - 16.5) / 2.0;
      r = 230; g = 110; b = 40;
      alpha = 0.35 * prog; // warm amber wash
    }
    // 18:30 - 20:00: Dusk (Twilight purple into dark night)
    else if (timeDec >= 18.5 && timeDec < 20.0) {
      const prog = (timeDec - 18.5) / 1.5;
      r = Math.round(140 * (1 - prog) + 10 * prog);
      g = Math.round(50 * (1 - prog) + 14 * prog);
      b = Math.round(100 * (1 - prog) + 36 * prog);
      alpha = 0.35 + 0.45 * prog;
    }
    // 20:00 - 24:00: Night
    else {
      r = 8; g = 12; b = 28;
      alpha = 0.84 - (moon.light * 0.28);
    }

    // Additional darkness for rain or overcast
    if (this.weather === 'overcast') alpha = Math.min(0.85, alpha + 0.18);
    if (this.weather === 'light_rain') alpha = Math.min(0.88, alpha + 0.25);
    if (this.weather === 'thunderstorm') alpha = Math.min(0.92, alpha + 0.38);

    // Lightning Flash subtracts darkness to pure bright light!
    if (this.lightningFlash > 0) {
      alpha = Math.max(0, alpha - this.lightningFlash);
      r = 240; g = 245; b = 255;
    }

    return { r, g, b, alpha };
  }

  // Draw rain particles on screen
  renderRain(ctx) {
    if (this.weather !== 'light_rain' && this.weather !== 'thunderstorm') return;

    ctx.save();
    ctx.strokeStyle = this.weather === 'thunderstorm' ? 'rgba(190, 220, 255, 0.65)' : 'rgba(165, 205, 255, 0.45)';
    ctx.lineWidth = 1.5;

    for (const drop of this.rainDrops) {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 7, drop.y + drop.length);
      ctx.stroke();

      // Splash ring on ground
      if (drop.splash > 0) {
        ctx.beginPath();
        ctx.ellipse(drop.x, drop.y + drop.length, 6, 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

window.WorldTimeSystem = WorldTimeSystem;
