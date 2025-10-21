// ==================== GAME RULES ====================
// Game rules, constraints, and validation logic

const Rules = {
  // Rule flags
  canMove: true,
  canInteract: true,
  canPause: true,

  // Constraints
  boundaries: {
    enabled: true,
    min: null,
    max: null
  },

  // ==================== INITIALIZE ====================
  init() {
    console.log('📜 Initializing Game Rules...');

    // Set boundaries from config
    const boundary = CONFIG.world.boundaryLimit;
    this.boundaries.min = -boundary;
    this.boundaries.max = boundary;

    console.log('✅ Game Rules initialized');
    return true;
  },

  // ==================== CHECK MOVEMENT ====================
  canPlayerMove() {
    if (!this.canMove) return false;
    if (window.GameState && window.GameState.isPaused) return false;
    return true;
  },

  // ==================== CHECK INTERACTION ====================
  canPlayerInteract() {
    if (!this.canInteract) return false;
    if (window.GameState && window.GameState.isPaused) return false;
    return true;
  },

  // ==================== CHECK PAUSE ====================
  canPlayerPause() {
    return this.canPause;
  },

  // ==================== VALIDATE POSITION ====================
  validatePosition(position) {
    if (!this.boundaries.enabled) return true;

    const { min, max } = this.boundaries;

    // Check if position is within boundaries
    const withinBounds = 
      position.x >= min && position.x <= max &&
      position.z >= min && position.z <= max;

    return withinBounds;
  },

  // ==================== CLAMP POSITION ====================
  clampPosition(position) {
    if (!this.boundaries.enabled) return position;

    const { min, max } = this.boundaries;

    position.x = Math.max(min, Math.min(max, position.x));
    position.z = Math.max(min, Math.min(max, position.z));

    return position;
  },

  // ==================== CHECK ZONE REQUIREMENTS ====================
  canEnterZone(zoneId) {
    // Check if zone requires prerequisites
    // For MVP, all zones are accessible
    return true;
  },

  // ==================== CHECK XP REQUIREMENTS ====================
  hasRequiredXP(requiredXP) {
    if (!window.GameState) return false;
    return window.GameState.xp >= requiredXP;
  },

  // ==================== CHECK LEVEL REQUIREMENTS ====================
  hasRequiredLevel(requiredLevel) {
    if (!window.GameState) return false;
    return window.GameState.level >= requiredLevel;
  },

  // ==================== VALIDATE SPEED ====================
  validateSpeed(speed) {
    const maxSpeed = CONFIG.bike.sprintSpeed * 2; // Safety limit
    return Math.min(Math.abs(speed), maxSpeed) * Math.sign(speed);
  },

  // ==================== CHECK COLLISION ====================
  checkCollision(position, radius = 1) {
    // Basic collision detection
    // Could be extended to check against obstacles

    // For now, just check boundaries
    return !this.validatePosition(position);
  },

  // ==================== ENABLE/DISABLE MOVEMENT ====================
  setCanMove(value) {
    this.canMove = value;
    console.log(`🎮 Movement ${value ? 'enabled' : 'disabled'}`);
  },

  // ==================== ENABLE/DISABLE INTERACTION ====================
  setCanInteract(value) {
    this.canInteract = value;
    console.log(`🎮 Interaction ${value ? 'enabled' : 'disabled'}`);
  },

  // ==================== ENABLE/DISABLE BOUNDARIES ====================
  setBoundaries(enabled) {
    this.boundaries.enabled = enabled;
    console.log(`🎮 Boundaries ${enabled ? 'enabled' : 'disabled'}`);
  },

  // ==================== GOD MODE ====================
  enableGodMode() {
    this.boundaries.enabled = false;
    console.log('👑 God mode enabled - no boundaries!');
  },

  disableGodMode() {
    this.boundaries.enabled = true;
    console.log('👑 God mode disabled');
  },

  // ==================== GET RULES INFO ====================
  getInfo() {
    return {
      canMove: this.canMove,
      canInteract: this.canInteract,
      canPause: this.canPause,
      boundaries: {
        enabled: this.boundaries.enabled,
        min: this.boundaries.min,
        max: this.boundaries.max
      }
    };
  },

  // ==================== RESET RULES ====================
  reset() {
    this.canMove = true;
    this.canInteract = true;
    this.canPause = true;
    this.boundaries.enabled = true;
    console.log('🔄 Rules reset to defaults');
  }
};

// Make globally available
window.Rules = Rules;