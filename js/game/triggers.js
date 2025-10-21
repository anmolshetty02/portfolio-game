// ==================== TRIGGERS ====================
// Handles zone entry/exit events and triggers overlays

const Triggers = {
  // Active triggers
  activeTriggers: new Map(),

  // Cooldown tracking
  cooldowns: new Map(),
  cooldownDuration: 2000, // ms

  // ==================== INITIALIZE ====================
  init() {
    console.log('⚡ Initializing Triggers...');
    console.log('✅ Triggers initialized');
    return true;
  },

  // ==================== ON ZONE ENTER ====================
  onZoneEnter(zoneData) {
    const zoneId = zoneData.id;

    // Check cooldown
    if (this.isOnCooldown(zoneId)) {
      return;
    }

    console.log(`⚡ Zone entered: ${zoneData.name}`);

    // Mark zone as visited
    const isFirstVisit = window.GameState 
      ? window.GameState.markZoneVisited(zoneId)
      : false;

    // Award XP only on first visit
    if (isFirstVisit && zoneData.xpReward > 0) {
      if (window.GameState) {
        window.GameState.addXP(zoneData.xpReward);
      }

      // Show toast notification
      if (window.Toasts) {
        window.Toasts.show(
          `${zoneData.name} DISCOVERED!`,
          `+${zoneData.xpReward} XP`,
          'success'
        );
      }
    }

    // Open overlay
    this.openZoneOverlay(zoneData);

    // Set cooldown
    this.setCooldown(zoneId);

    // Store active trigger
    this.activeTriggers.set(zoneId, {
      zoneData,
      enteredAt: Date.now()
    });
  },

  // ==================== ON ZONE EXIT ====================
  onZoneExit(zoneData) {
    const zoneId = zoneData.id;

    console.log(`⚡ Zone exited: ${zoneData.name}`);

    // Remove from active triggers
    this.activeTriggers.delete(zoneId);

    // Could trigger exit effects here
  },

  // ==================== OPEN ZONE OVERLAY ====================
  openZoneOverlay(zoneData) {
    const overlayId = zoneData.overlayId;

    if (!overlayId) {
      console.warn(`⚠️ No overlay ID for zone: ${zoneData.name}`);
      return;
    }

    // Open overlay
    if (window.Overlays) {
      window.Overlays.open(overlayId);
    } else {
      console.error('❌ Overlays system not available');
    }

    // Pause game
    if (window.GameState) {
      window.GameState.pause();
    }
  },

  // ==================== SET COOLDOWN ====================
  setCooldown(zoneId) {
    this.cooldowns.set(zoneId, Date.now() + this.cooldownDuration);

    // Auto-clear cooldown
    setTimeout(() => {
      this.cooldowns.delete(zoneId);
    }, this.cooldownDuration);
  },

  // ==================== CHECK COOLDOWN ====================
  isOnCooldown(zoneId) {
    const cooldownEnd = this.cooldowns.get(zoneId);
    if (!cooldownEnd) return false;

    return Date.now() < cooldownEnd;
  },

  // ==================== GET ACTIVE TRIGGERS ====================
  getActiveTriggers() {
    return Array.from(this.activeTriggers.values());
  },

  // ==================== IS ZONE ACTIVE ====================
  isZoneActive(zoneId) {
    return this.activeTriggers.has(zoneId);
  },

  // ==================== CLEAR ALL TRIGGERS ====================
  clearAll() {
    this.activeTriggers.clear();
    this.cooldowns.clear();
    console.log('🗑️ All triggers cleared');
  },

  // ==================== CUSTOM EVENT TRIGGER ====================
  triggerCustomEvent(eventName, data) {
    console.log(`⚡ Custom event: ${eventName}`, data);

    // Handle custom events
    switch(eventName) {
      case 'tutorial_complete':
        this.onTutorialComplete();
        break;
      
      case 'all_zones_visited':
        this.onAllZonesVisited();
        break;
      
      default:
        console.warn(`⚠️ Unknown event: ${eventName}`);
    }
  },

  // ==================== ON TUTORIAL COMPLETE ====================
  onTutorialComplete() {
    console.log('🎓 Tutorial completed!');

    if (window.GameState) {
      window.GameState.tutorialComplete = true;
      window.GameState.saveState();
    }

    if (window.Toasts) {
      window.Toasts.show(
        'TUTORIAL COMPLETE!',
        'You\'re ready to explore!',
        'info'
      );
    }
  },

  // ==================== ON ALL ZONES VISITED ====================
  onAllZonesVisited() {
    console.log('🎊 All zones visited!');

    // Could trigger special ending sequence
    if (window.Toasts) {
      window.Toasts.show(
        'EXPLORATION COMPLETE!',
        '100% Portfolio Discovered',
        'success'
      );
    }
  },

  // ==================== GET INFO ====================
  getInfo() {
    return {
      activeTriggers: this.activeTriggers.size,
      cooldowns: this.cooldowns.size,
      triggers: Array.from(this.activeTriggers.keys())
    };
  }
};

// Make globally available
window.Triggers = Triggers;