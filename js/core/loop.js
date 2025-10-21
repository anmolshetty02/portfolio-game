// ==================== GAME LOOP ====================
// Main animation loop and update cycle

const GameLoop = {
  // Loop state
  isRunning: false,
  isPaused: false,
  animationFrameId: null,

  // Timing
  clock: null,
  deltaTime: 0,
  elapsedTime: 0,
  lastFrameTime: 0,

  // FPS tracking
  fps: {
    current: 0,
    samples: [],
    maxSamples: 60
  },

  // Update callbacks
  updateCallbacks: [],
  renderCallbacks: [],

  // ==================== INITIALIZE ====================
  init() {
    console.log('🔄 Initializing Game Loop...');

    // Create clock
    this.clock = new THREE.Clock();

    console.log('✅ Game Loop initialized');
    return true;
  },

  // ==================== START LOOP ====================
  start() {
    if (this.isRunning) {
      console.warn('⚠️ Game loop already running');
      return;
    }

    console.log('▶️ Starting game loop...');
    this.isRunning = true;
    this.isPaused = false;
    this.clock.start();

    // Start animation loop
    this.loop();
  },

  // ==================== MAIN LOOP ====================
  loop() {
    if (!this.isRunning) return;

    // Request next frame
    this.animationFrameId = requestAnimationFrame(() => this.loop());

    // Get delta time
    this.deltaTime = this.clock.getDelta();
    this.elapsedTime = this.clock.getElapsedTime();

    // Update FPS
    this.updateFPS();

    // Skip update if paused
    if (this.isPaused) {
      this.render();
      return;
    }

    // Update phase
    this.update(this.deltaTime, this.elapsedTime);

    // Render phase
    this.render();
  },

  // ==================== UPDATE PHASE ====================
  update(deltaTime, elapsedTime) {
    // Call all registered update callbacks
    this.updateCallbacks.forEach(callback => {
      try {
        callback(deltaTime, elapsedTime);
      } catch (error) {
        console.error('❌ Error in update callback:', error);
      }
    });
  },

  // ==================== RENDER PHASE ====================
  render() {
    // Call all registered render callbacks
    this.renderCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Error in render callback:', error);
      }
    });

    // Render the scene
    if (window.Renderer && window.SceneManager) {
      window.Renderer.render(
        window.SceneManager.getScene(),
        window.SceneManager.getCamera()
      );
    }
  },

  // ==================== UPDATE FPS ====================
  updateFPS() {
    const currentTime = performance.now();
    const frameDelta = currentTime - this.lastFrameTime;

    if (frameDelta > 0) {
      const currentFPS = 1000 / frameDelta;
      this.fps.samples.push(currentFPS);

      // Keep only recent samples
      if (this.fps.samples.length > this.fps.maxSamples) {
        this.fps.samples.shift();
      }

      // Calculate average FPS
      this.fps.current = Math.round(
        this.fps.samples.reduce((a, b) => a + b, 0) / this.fps.samples.length
      );
    }

    this.lastFrameTime = currentTime;
  },

  // ==================== REGISTER UPDATE CALLBACK ====================
  onUpdate(callback) {
    if (typeof callback === 'function') {
      this.updateCallbacks.push(callback);
      return true;
    }
    return false;
  },

  // ==================== REGISTER RENDER CALLBACK ====================
  onRender(callback) {
    if (typeof callback === 'function') {
      this.renderCallbacks.push(callback);
      return true;
    }
    return false;
  },

  // ==================== PAUSE ====================
  pause() {
    if (!this.isRunning) return;
    
    this.isPaused = true;
    this.clock.stop();
    console.log('⏸️ Game loop paused');
  },

  // ==================== RESUME ====================
  resume() {
    if (!this.isRunning) return;
    
    this.isPaused = false;
    this.clock.start();
    console.log('▶️ Game loop resumed');
  },

  // ==================== TOGGLE PAUSE ====================
  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  },

  // ==================== STOP ====================
  stop() {
    if (!this.isRunning) return;

    console.log('⏹️ Stopping game loop...');
    this.isRunning = false;

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Stop clock
    this.clock.stop();
  },

  // ==================== GET FPS ====================
  getFPS() {
    return this.fps.current;
  },

  // ==================== GET ELAPSED TIME ====================
  getElapsedTime() {
    return this.elapsedTime;
  },

  // ==================== GET DELTA TIME ====================
  getDeltaTime() {
    return this.deltaTime;
  },

  // ==================== IS PAUSED ====================
  isPausedState() {
    return this.isPaused;
  },

  // ==================== GET INFO ====================
  getInfo() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      fps: this.fps.current,
      elapsedTime: this.elapsedTime.toFixed(2),
      deltaTime: this.deltaTime.toFixed(4),
      updateCallbacks: this.updateCallbacks.length,
      renderCallbacks: this.renderCallbacks.length
    };
  },

  // ==================== DISPOSE ====================
  dispose() {
    this.stop();
    this.updateCallbacks = [];
    this.renderCallbacks = [];
    console.log('🗑️ Game Loop disposed');
  }
};

// Make globally available
window.GameLoop = GameLoop;