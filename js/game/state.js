// ==================== GAME STATE ====================
// Manages game state, progress, and player data

const GameState = {
  // Game status
  isInitialized: false,
  isPaused: false,
  isGameOver: false,

  // Player progress
  xp: 0,
  maxXP: 100,
  level: 1,

  // Zone tracking
  visitedZones: new Set(),
  currentZone: null,
  totalZones: 0,

  // Time tracking
  startTime: null,
  playTime: 0,

  // Tutorial
  tutorialComplete: false,

  // ==================== INITIALIZE ====================
  init() {
    console.log('🎮 Initializing Game State...');

    // Get total zones from config
    this.totalZones = CONFIG.game.totalZones;
    this.maxXP = this.totalZones * CONFIG.game.xpPerZone;

    // Set start time
    this.startTime = Date.now();

    // Load saved state if exists
    this.loadState();

    this.isInitialized = true;
    console.log('✅ Game State initialized');
    return true;
  },

  // ==================== ADD XP ====================
  addXP(amount) {
    if (!CONFIG.game.enableXPSystem) return;

    const oldXP = this.xp;
    this.xp = Math.min(this.xp + amount, this.maxXP);

    console.log(`⭐ XP gained: +${amount} (${oldXP} → ${this.xp})`);

    // Update HUD
    if (window.HUD) {
      window.HUD.updateXP(this.xp, this.maxXP);
    }

    // Check for level up
    this.checkLevelUp();

    // Save state
    this.saveState();

    return this.xp;
  },

  // ==================== CHECK LEVEL UP ====================
  checkLevelUp() {
    const newLevel = Math.floor(this.xp / CONFIG.game.xpPerZone) + 1;

    if (newLevel > this.level) {
      this.level = newLevel;
      console.log(`🎉 Level up! Now level ${this.level}`);

      // Show toast notification
      if (window.Toasts) {
        window.Toasts.show(
          'LEVEL UP!',
          `You reached level ${this.level}`,
          'success'
        );
      }
    }
  },

  // ==================== MARK ZONE VISITED ====================
  markZoneVisited(zoneId) {
    if (this.visitedZones.has(zoneId)) {
      return false; // Already visited
    }

    this.visitedZones.add(zoneId);
    console.log(`📍 Zone visited: ${zoneId} (${this.visitedZones.size}/${this.totalZones})`);

    // Check if all zones visited
    if (this.visitedZones.size === this.totalZones) {
      this.onAllZonesVisited();
    }

    // Save state
    this.saveState();

    return true;
  },

  // ==================== ON ALL ZONES VISITED ====================
  onAllZonesVisited() {
    console.log('🎊 All zones discovered!');

    // Show completion toast
    if (window.Toasts) {
      window.Toasts.show(
        'PORTFOLIO COMPLETE!',
        'You\'ve explored all zones. Thanks for visiting!',
        'success'
      );
    }

    // Could trigger additional effects here
  },

  // ==================== SET CURRENT ZONE ====================
  setCurrentZone(zoneName) {
    if (this.currentZone !== zoneName) {
      this.currentZone = zoneName;

      if (CONFIG.debug.enabled) {
        console.log(`📍 Current zone: ${zoneName}`);
      }
    }
  },

  // ==================== GET COMPLETION PERCENTAGE ====================
  getCompletionPercentage() {
    return Math.floor((this.visitedZones.size / this.totalZones) * 100);
  },

  // ==================== GET PLAY TIME ====================
  getPlayTime() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000); // seconds
  },

  // ==================== PAUSE ====================
  pause() {
    this.isPaused = true;

    // Pause game loop
    if (window.GameLoop) {
      window.GameLoop.pause();
    }

    console.log('⏸️ Game paused');
  },

  // ==================== RESUME ====================
  resume() {
    this.isPaused = false;

    // Resume game loop
    if (window.GameLoop) {
      window.GameLoop.resume();
    }

    console.log('▶️ Game resumed');
  },

  // ==================== TOGGLE PAUSE ====================
  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  },

  // ==================== SAVE STATE ====================
  saveState() {
    try {
      const state = {
        xp: this.xp,
        level: this.level,
        visitedZones: Array.from(this.visitedZones),
        tutorialComplete: this.tutorialComplete,
        playTime: this.getPlayTime()
      };

      // Note: localStorage not available in Claude artifacts
      // In production, use: localStorage.setItem('portfolioGameState', JSON.stringify(state));
      
      if (CONFIG.debug.enabled) {
        console.log('💾 State saved:', state);
      }
    } catch (error) {
      console.error('❌ Failed to save state:', error);
    }
  },

  // ==================== LOAD STATE ====================
  loadState() {
    try {
      // Note: localStorage not available in Claude artifacts
      // In production, use:
      // const saved = localStorage.getItem('portfolioGameState');
      // if (saved) {
      //   const state = JSON.parse(saved);
      //   this.xp = state.xp || 0;
      //   this.level = state.level || 1;
      //   this.visitedZones = new Set(state.visitedZones || []);
      //   this.tutorialComplete = state.tutorialComplete || false;
      // }

      if (CONFIG.debug.enabled) {
        console.log('💾 State loaded');
      }
    } catch (error) {
      console.error('❌ Failed to load state:', error);
    }
  },

  // ==================== RESET STATE ====================
  reset() {
    this.xp = 0;
    this.level = 1;
    this.visitedZones.clear();
    this.currentZone = null;
    this.tutorialComplete = false;
    this.isPaused = false;
    this.startTime = Date.now();

    console.log('🔄 Game state reset');

    // Clear saved state
    // In production: localStorage.removeItem('portfolioGameState');

    // Update UI
    if (window.HUD) {
      window.HUD.updateXP(0, this.maxXP);
    }
  },

  // ==================== GET STATE INFO ====================
  getInfo() {
    return {
      xp: this.xp,
      maxXP: this.maxXP,
      level: this.level,
      visitedZones: this.visitedZones.size,
      totalZones: this.totalZones,
      completion: this.getCompletionPercentage() + '%',
      playTime: this.getPlayTime() + 's',
      currentZone: this.currentZone,
      isPaused: this.isPaused
    };
  }
};

// Make globally available
window.GameState = GameState;