// ==================== HUD (HEADS-UP DISPLAY) ====================
// On-screen game interface - zone info, XP bar, controls

const HUD = {
  // DOM elements
  elements: {
    zoneLabel: null,
    zoneSubtitle: null,
    xpValue: null,
    xpFill: null,
    hud: null
  },

  // State
  isVisible: true,

  // ==================== INITIALIZE ====================
  init() {
    console.log('📺 Initializing HUD...');

    // Get DOM elements
    this.elements.hud = document.getElementById('hud');
    this.elements.zoneLabel = document.getElementById('zone-label');
    this.elements.zoneSubtitle = document.getElementById('zone-subtitle');
    this.elements.xpValue = document.getElementById('xp-value');
    this.elements.xpFill = document.getElementById('xp-fill');

    // Check if elements exist
    if (!this.elements.hud) {
      console.error('❌ HUD element not found');
      return false;
    }

    // Initialize display
    this.updateZone('EXPLORATION MODE', 'Navigate to zones to unlock content');
    this.updateXP(0, 100);

    console.log('✅ HUD initialized');
    return true;
  },

  // ==================== UPDATE ZONE ====================
  updateZone(zoneName, subtitle = '') {
    if (this.elements.zoneLabel) {
      this.elements.zoneLabel.textContent = zoneName;
    }

    if (this.elements.zoneSubtitle) {
      this.elements.zoneSubtitle.textContent = subtitle;
    }

    if (CONFIG.debug.logEvents) {
      console.log(`📺 HUD Zone updated: ${zoneName}`);
    }
  },

  // ==================== UPDATE XP ====================
  updateXP(current, max) {
    const percentage = max > 0 ? (current / max) * 100 : 0;

    if (this.elements.xpValue) {
      this.elements.xpValue.textContent = Math.floor(percentage);
    }

    if (this.elements.xpFill) {
      this.elements.xpFill.style.width = percentage + '%';
    }

    if (CONFIG.debug.logEvents) {
      console.log(`📺 HUD XP updated: ${current}/${max} (${percentage.toFixed(1)}%)`);
    }
  },

  // ==================== SHOW HUD ====================
  show() {
    if (this.elements.hud) {
      this.elements.hud.style.display = 'block';
      this.isVisible = true;
    }
  },

  // ==================== HIDE HUD ====================
  hide() {
    if (this.elements.hud) {
      this.elements.hud.style.display = 'none';
      this.isVisible = false;
    }
  },

  // ==================== TOGGLE HUD ====================
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  },

  // ==================== UPDATE FPS COUNTER (DEBUG) ====================
  updateFPS(fps) {
    // Create FPS counter if in debug mode
    if (CONFIG.debug.showStats) {
      let fpsElement = document.getElementById('fps-counter');
      
      if (!fpsElement) {
        fpsElement = document.createElement('div');
        fpsElement.id = 'fps-counter';
        fpsElement.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: #0ff;
          padding: 5px 10px;
          font-family: monospace;
          font-size: 14px;
          border: 1px solid #0ff;
          border-radius: 5px;
          z-index: 9999;
        `;
        document.body.appendChild(fpsElement);
      }

      fpsElement.textContent = `FPS: ${fps}`;
    }
  },

  // ==================== SHOW MESSAGE ====================
  showMessage(message, duration = 3000) {
    // Create temporary message element
    const msgElement = document.createElement('div');
    msgElement.textContent = message;
    msgElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 255, 255, 0.9);
      color: #000;
      padding: 1rem 2rem;
      font-size: 1.5rem;
      font-weight: bold;
      border-radius: 10px;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;

    document.body.appendChild(msgElement);

    // Remove after duration
    setTimeout(() => {
      msgElement.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(msgElement);
      }, 300);
    }, duration);
  },

  // ==================== UPDATE LOADING BAR ====================
  updateLoadingBar(percentage) {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  },

  // ==================== HIDE LOADING SCREEN ====================
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      console.log('📺 Loading screen hidden');
    }
  },

  // ==================== SHOW LOADING SCREEN ====================
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
      console.log('📺 Loading screen shown');
    }
  },

  // ==================== GET INFO ====================
  getInfo() {
    return {
      isVisible: this.isVisible,
      elements: Object.keys(this.elements).map(key => ({
        name: key,
        exists: this.elements[key] !== null
      }))
    };
  }
};

// Make globally available
window.HUD = HUD;