// ==================== INPUT MANAGEMENT ====================
// Keyboard and mouse input handling

const InputManager = {
  // Key states
  keys: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    pause: false,
    centerCamera: false
  },

  // Mouse state
  mouse: {
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    isLocked: false
  },

  // Event listeners
  listeners: [],

  // ==================== INITIALIZE INPUT ====================
  init() {
    console.log('🎮 Initializing Input Manager...');

    // Setup keyboard listeners
    this.setupKeyboard();

    // Setup mouse listeners (if enabled)
    if (CONFIG.controls.mouse.enableOrbit) {
      this.setupMouse();
    }

    console.log('✅ Input Manager initialized');
    return true;
  },

  // ==================== SETUP KEYBOARD ====================
  setupKeyboard() {
    // Keydown event
    const keydownHandler = (event) => {
      this.handleKeyDown(event);
    };

    // Keyup event
    const keyupHandler = (event) => {
      this.handleKeyUp(event);
    };

    // Add event listeners
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);

    // Store for cleanup
    this.listeners.push(
      { element: window, event: 'keydown', handler: keydownHandler },
      { element: window, event: 'keyup', handler: keyupHandler }
    );
  },

  // ==================== HANDLE KEY DOWN ====================
  handleKeyDown(event) {
    const code = event.code;

    // Forward
    if (CONFIG.controls.keyboard.forward.includes(code)) {
      this.keys.forward = true;
    }

    // Backward
    if (CONFIG.controls.keyboard.backward.includes(code)) {
      this.keys.backward = true;
    }

    // Left
    if (CONFIG.controls.keyboard.left.includes(code)) {
      this.keys.left = true;
    }

    // Right
    if (CONFIG.controls.keyboard.right.includes(code)) {
      this.keys.right = true;
    }

    // Sprint
    if (CONFIG.controls.keyboard.sprint.includes(code)) {
      this.keys.sprint = true;
    }

    // Pause
    if (CONFIG.controls.keyboard.pause.includes(code)) {
      this.keys.pause = !this.keys.pause; // Toggle
      if (window.GameState) {
        window.GameState.togglePause();
      }
    }

    // Center camera
    if (CONFIG.controls.keyboard.centerCamera.includes(code)) {
      this.keys.centerCamera = true;
      if (window.Bike) {
        window.Bike.resetPosition();
      }
    }

    if (CONFIG.debug.logEvents) {
      console.log('⌨️ Key down:', code);
    }
  },

  // ==================== HANDLE KEY UP ====================
  handleKeyUp(event) {
    const code = event.code;

    // Forward
    if (CONFIG.controls.keyboard.forward.includes(code)) {
      this.keys.forward = false;
    }

    // Backward
    if (CONFIG.controls.keyboard.backward.includes(code)) {
      this.keys.backward = false;
    }

    // Left
    if (CONFIG.controls.keyboard.left.includes(code)) {
      this.keys.left = false;
    }

    // Right
    if (CONFIG.controls.keyboard.right.includes(code)) {
      this.keys.right = false;
    }

    // Sprint
    if (CONFIG.controls.keyboard.sprint.includes(code)) {
      this.keys.sprint = false;
    }

    // Center camera
    if (CONFIG.controls.keyboard.centerCamera.includes(code)) {
      this.keys.centerCamera = false;
    }

    if (CONFIG.debug.logEvents) {
      console.log('⌨️ Key up:', code);
    }
  },

  // ==================== SETUP MOUSE ====================
  setupMouse() {
    // Mouse move event
    const mousemoveHandler = (event) => {
      this.handleMouseMove(event);
    };

    // Add event listener
    window.addEventListener('mousemove', mousemoveHandler);

    // Store for cleanup
    this.listeners.push({
      element: window,
      event: 'mousemove',
      handler: mousemoveHandler
    });

    // Pointer lock (optional)
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
      canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
      });
    }
  },

  // ==================== HANDLE MOUSE MOVE ====================
  handleMouseMove(event) {
    // Update mouse position
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    // Update delta
    this.mouse.deltaX = event.movementX || 0;
    this.mouse.deltaY = event.movementY || 0;

    // Check pointer lock
    this.mouse.isLocked = document.pointerLockElement !== null;

    if (CONFIG.debug.logEvents) {
      console.log('🖱️ Mouse:', this.mouse);
    }
  },

  // ==================== GET KEY STATE ====================
  isKeyPressed(keyName) {
    return this.keys[keyName] || false;
  },

  // ==================== GET MOUSE STATE ====================
  getMouseState() {
    return { ...this.mouse };
  },

  // ==================== RESET KEYS ====================
  resetKeys() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key] = false;
    });
  },

  // ==================== GET INPUT SUMMARY ====================
  getInputSummary() {
    return {
      forward: this.keys.forward,
      backward: this.keys.backward,
      left: this.keys.left,
      right: this.keys.right,
      sprint: this.keys.sprint,
      pause: this.keys.pause
    };
  },

  // ==================== DISPOSE ====================
  dispose() {
    // Remove all event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    this.listeners = [];
    this.resetKeys();

    console.log('🗑️ Input Manager disposed');
  }
};

// Make globally available
window.InputManager = InputManager;