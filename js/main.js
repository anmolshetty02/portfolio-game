// ==================== MAIN.JS ====================
// Game bootstrap and initialization
// This file starts everything in the correct order

(async function() {
  'use strict';

  console.log('🎮 TRON Portfolio Game Starting...');
  console.log('================================');

  // ==================== LOADING SEQUENCE ====================
  
  try {
    // ==================== PHASE 1: LOAD DATA ====================
    console.log('📦 Phase 1: Loading data files...');
    
    if (!window.DataLoader) {
      throw new Error('DataLoader not found');
    }

    const dataLoaded = await DataLoader.loadAll();
    if (!dataLoaded) {
      throw new Error('Failed to load data files');
    }

    console.log('✅ Data loaded successfully');
    updateLoadingProgress(20);

    // ==================== PHASE 2: INITIALIZE CORE SYSTEMS ====================
    console.log('⚙️ Phase 2: Initializing core systems...');

    // Initialize renderer
    if (!window.Renderer) throw new Error('Renderer not found');
    if (!Renderer.init()) throw new Error('Renderer initialization failed');

    // Initialize scene
    if (!window.SceneManager) throw new Error('SceneManager not found');
    if (!SceneManager.init()) throw new Error('Scene initialization failed');

    // Initialize input
    if (!window.InputManager) throw new Error('InputManager not found');
    if (!InputManager.init()) throw new Error('Input initialization failed');

    // Initialize game loop
    if (!window.GameLoop) throw new Error('GameLoop not found');
    if (!GameLoop.init()) throw new Error('GameLoop initialization failed');

    console.log('✅ Core systems initialized');
    updateLoadingProgress(40);

    // ==================== PHASE 3: INITIALIZE WORLD ====================
    console.log('🌍 Phase 3: Building world...');

    // Create grid
    if (!window.Grid) throw new Error('Grid not found');
    if (!Grid.create()) throw new Error('Grid creation failed');

    // Create bike
    if (!window.Bike) throw new Error('Bike not found');
    if (!Bike.create()) throw new Error('Bike creation failed');

    // Create zones
    if (!window.Zones) throw new Error('Zones not found');
    if (!await Zones.create()) throw new Error('Zones creation failed');

    // Create trail (optional)
    if (window.Trail && CONFIG.visuals.enableTrails) {
      Trail.create();
    }

    console.log('✅ World built successfully');
    updateLoadingProgress(60);

    // ==================== PHASE 4: INITIALIZE GAME LOGIC ====================
    console.log('🎲 Phase 4: Initializing game logic...');

    // Initialize game state
    if (!window.GameState) throw new Error('GameState not found');
    if (!GameState.init()) throw new Error('GameState initialization failed');

    // Initialize triggers
    if (!window.Triggers) throw new Error('Triggers not found');
    if (!Triggers.init()) throw new Error('Triggers initialization failed');

    // Initialize rules
    if (!window.Rules) throw new Error('Rules not found');
    if (!Rules.init()) throw new Error('Rules initialization failed');

    console.log('✅ Game logic initialized');
    updateLoadingProgress(80);

    // ==================== PHASE 5: INITIALIZE UI ====================
    console.log('🖥️ Phase 5: Initializing UI...');

    // Initialize HUD
    if (!window.HUD) throw new Error('HUD not found');
    if (!HUD.init()) throw new Error('HUD initialization failed');

    // Initialize overlays
    if (!window.Overlays) throw new Error('Overlays not found');
    if (!Overlays.init()) throw new Error('Overlays initialization failed');

    // Initialize toasts
    if (!window.Toasts) throw new Error('Toasts not found');
    if (!Toasts.init()) throw new Error('Toasts initialization failed');

    // Initialize theme manager
    if (window.ThemeManager) {
      ThemeManager.init();
    }

    console.log('✅ UI initialized');
    updateLoadingProgress(90);

    // ==================== PHASE 6: REGISTER UPDATE CALLBACKS ====================
    console.log('🔗 Phase 6: Connecting systems...');

    // Register update callbacks
    GameLoop.onUpdate((deltaTime, elapsedTime) => {
      // Update world objects
      if (Grid) Grid.update(deltaTime, elapsedTime);
      if (Bike) Bike.update(deltaTime);
      if (Zones) Zones.checkTriggers(Bike.getPosition());
      if (Zones) Zones.update(deltaTime, elapsedTime);
      if (Trail && CONFIG.visuals.enableTrails) Trail.update();

      // Update scene lighting
      if (SceneManager) SceneManager.animateLights(elapsedTime);
    });

    // Register render callbacks (if needed)
    // GameLoop.onRender(() => {
    //   // Custom render logic
    // });

    console.log('✅ Systems connected');
    updateLoadingProgress(95);

    // ==================== PHASE 7: SETUP EVENT LISTENERS ====================
    console.log('🎧 Phase 7: Setting up event listeners...');

    // Window resize handler
    window.addEventListener('resize', () => {
      Renderer.onWindowResize(SceneManager.getCamera());
    });

    // Key to start game
    let gameStarted = false;
    const startGame = () => {
      if (gameStarted) return;
      gameStarted = true;

      console.log('🎮 Starting game...');

      // Hide loading screen
      HUD.hideLoadingScreen();

      // Start game loop
      GameLoop.start();

      // Show welcome toast
      if (Toasts) {
        Toasts.show(
          'WELCOME TO THE GRID',
          'Use WASD or Arrow keys to navigate',
          'info',
          4000
        );
      }

      // Remove start listener
      document.removeEventListener('keydown', startHandler);
    };

    const startHandler = (e) => {
      startGame();
    };

    document.addEventListener('keydown', startHandler);

    console.log('✅ Event listeners ready');
    updateLoadingProgress(100);

    // ==================== GAME READY ====================
    console.log('================================');
    console.log('✅ GAME READY!');
    console.log('Press any key to start...');
    console.log('================================');

    // Optional: Auto-start after delay (for testing)
    if (CONFIG.debug.enabled) {
      setTimeout(() => {
        console.log('🔧 Debug mode: Auto-starting game...');
        startGame();
      }, 1000);
    }

  } catch (error) {
    // ==================== ERROR HANDLING ====================
    console.error('================================');
    console.error('❌ INITIALIZATION FAILED');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('================================');

    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 2rem;
      border-radius: 10px;
      font-family: monospace;
      z-index: 99999;
      max-width: 600px;
    `;
    errorDiv.innerHTML = `
      <h2 style="margin-bottom: 1rem;">⚠️ INITIALIZATION ERROR</h2>
      <p style="margin-bottom: 1rem;">${error.message}</p>
      <p style="font-size: 0.9rem; opacity: 0.8;">Check the browser console (F12) for details.</p>
    `;
    document.body.appendChild(errorDiv);
  }

  // ==================== HELPER FUNCTIONS ====================

  function updateLoadingProgress(percentage) {
    if (window.HUD) {
      HUD.updateLoadingBar(percentage);
    }
  }

  // ==================== DEBUG PANEL ====================
  if (CONFIG.debug.enabled) {
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #0ff;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      border: 1px solid #0ff;
      border-radius: 5px;
      max-width: 300px;
      z-index: 9998;
    `;

    document.body.appendChild(debugPanel);

    // Update debug info
    setInterval(() => {
      if (!GameLoop.isRunning) return;

      const info = {
        FPS: GameLoop.getFPS(),
        BikePos: Bike ? `(${Bike.getPosition().x.toFixed(1)}, ${Bike.getPosition().z.toFixed(1)})` : 'N/A',
        Zone: GameState ? GameState.currentZone || 'None' : 'N/A',
        XP: GameState ? `${GameState.xp}/${GameState.maxXP}` : 'N/A',
        Paused: GameLoop.isPausedState() ? 'Yes' : 'No'
      };

      debugPanel.innerHTML = '<strong>DEBUG INFO</strong><br>' +
        Object.entries(info).map(([key, val]) => `${key}: ${val}`).join('<br>');
    }, 100);
  }

})();

// ==================== GLOBAL ERROR HANDLER ====================
window.addEventListener('error', (event) => {
  console.error('🔴 Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled promise rejection:', event.reason);
});