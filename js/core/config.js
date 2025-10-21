// ==================== GAME CONFIGURATION ====================
// Global settings and constants for the TRON portfolio game

const CONFIG = {
  // ==================== WORLD SETTINGS ====================
  world: {
    gridSize: 200,
    gridDivisions: 40,
    boundaryLimit: 90,
    fogDensity: 0.015
  },

  // ==================== BIKE SETTINGS ====================
  bike: {
    speed: 0.5,
    sprintSpeed: 1.0,
    rotationSpeed: 0.05,
    acceleration: 0.1,
    deceleration: 0.05,
    startPosition: { x: 0, y: 0.5, z: 0 },
    cameraOffset: { x: 0, y: 15, z: 20 },
    cameraLerpSpeed: 0.1
  },

  // ==================== ZONE SETTINGS ====================
  zones: {
    triggerDistance: 10,
    markerHeight: 0.5,
    markerRadius: 8,
    labelHeight: 8,
    labelFloatAmplitude: 0.5,
    rotationSpeed: 0.01
  },

  // ==================== VISUAL SETTINGS ====================
  visuals: {
    enableTrails: true,
    trailLength: 50,
    trailOpacity: 0.6,
    ambientLightIntensity: 0.3,
    pointLight1Intensity: 1.0,
    pointLight2Intensity: 0.8,
    enableFog: true,
    enableGlow: true
  },

  // ==================== CAMERA SETTINGS ====================
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    initialPosition: { x: 0, y: 15, z: 20 }
  },

  // ==================== UI SETTINGS ====================
  ui: {
    loadingDuration: 2000, // ms
    toastDuration: 3000, // ms
    overlayTransitionDuration: 400, // ms
    xpAnimationDuration: 800 // ms
  },

  // ==================== COLORS (HEX) ====================
  colors: {
    primary: 0x00ffff,      // Cyan
    secondary: 0xff00ff,    // Magenta
    accent: 0x00ff00,       // Green
    warning: 0xffff00,      // Yellow
    danger: 0xff0000,       // Red
    background: 0x000000,   // Black
    gridPrimary: 0x00ffff,  // Cyan
    gridSecondary: 0xff00ff, // Magenta
    floorBase: 0x001a33     // Dark blue
  },

  // ==================== AUDIO SETTINGS ====================
  audio: {
    enabled: true,
    volume: 0.5,
    ambientVolume: 0.3,
    sfxVolume: 0.7
  },

  // ==================== PERFORMANCE SETTINGS ====================
  performance: {
    targetFPS: 60,
    pixelRatio: window.devicePixelRatio,
    antialias: true,
    shadows: false, // Disable for better performance
    maxParticles: 1000
  },

  // ==================== GAME MECHANICS ====================
  game: {
    totalZones: 5,
    xpPerZone: 25,
    enableXPSystem: true,
    enableMinimap: false, // Future feature
    enableTutorial: true,
    tutorialDuration: 5000 // ms
  },

  // ==================== CONTROLS ====================
  controls: {
    keyboard: {
      forward: ['KeyW', 'ArrowUp'],
      backward: ['KeyS', 'ArrowDown'],
      left: ['KeyA', 'ArrowLeft'],
      right: ['KeyD', 'ArrowRight'],
      sprint: ['ShiftLeft', 'ShiftRight'],
      pause: ['Escape'],
      centerCamera: ['KeyC']
    },
    mouse: {
      enableOrbit: false, // Keep camera locked to bike
      sensitivity: 0.002
    }
  },

  // ==================== DATA PATHS ====================
  data: {
    zones: './data/zones.json',
    profile: './data/profile.json',
    projects: './data/projects.json',
    experience: './data/experience.json',
    skills: './data/skills.json'
  },

  // ==================== OVERLAY PATHS ====================
  overlays: {
    about: './ui/overlay-about.html',
    projects: './ui/overlay-projects.html',
    experience: './ui/overlay-experience.html',
    contact: './ui/overlay-contact.html',
    skills: './ui/overlay-skills.html'
  },

  // ==================== DEBUG SETTINGS ====================
  debug: {
    enabled: false,
    showStats: false,
    showZoneBounds: false,
    logEvents: false,
    godMode: false // No boundaries
  }
};

// ==================== HELPER FUNCTIONS ====================

// Convert hex color to RGB object
CONFIG.hexToRgb = function(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.toString(16));
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
};

// Get color as CSS string
CONFIG.getColorCSS = function(colorName) {
  const hex = this.colors[colorName];
  return '#' + hex.toString(16).padStart(6, '0');
};

// Check if mobile device
CONFIG.isMobile = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Adjust settings for mobile
if (CONFIG.isMobile()) {
  CONFIG.performance.pixelRatio = 1;
  CONFIG.performance.antialias = false;
  CONFIG.visuals.enableTrails = false;
  CONFIG.bike.speed = 0.7; // Slightly faster on mobile
}

// Make CONFIG globally available
window.CONFIG = CONFIG;

// Log initialization
if (CONFIG.debug.enabled) {
  console.log('🎮 CONFIG initialized:', CONFIG);
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}