// ==================== RENDERER SETUP ====================
// Three.js WebGL renderer initialization and management

const Renderer = {
  // Three.js instances
  renderer: null,
  canvas: null,

  // ==================== INITIALIZE RENDERER ====================
  init() {
    console.log('🎨 Initializing Renderer...');

    // Get canvas element
    this.canvas = document.getElementById('game-canvas');
    
    if (!this.canvas) {
      console.error('❌ Canvas element not found!');
      return false;
    }

    try {
      // Create WebGL renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: CONFIG.performance.antialias,
        alpha: false,
        powerPreference: 'high-performance'
      });

      // Set size to window dimensions
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Set pixel ratio (capped for performance)
      this.renderer.setPixelRatio(Math.min(CONFIG.performance.pixelRatio, 2));

      // Set background color
      this.renderer.setClearColor(CONFIG.colors.background, 1);

      // Enable shadows (if configured)
      if (CONFIG.performance.shadows) {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      // Tone mapping for better colors
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1;

      console.log('✅ Renderer initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Failed to initialize renderer:', error);
      return false;
    }
  },

  // ==================== RENDER FRAME ====================
  render(scene, camera) {
    if (!this.renderer || !scene || !camera) {
      console.error('❌ Cannot render: missing renderer, scene, or camera');
      return;
    }

    this.renderer.render(scene, camera);
  },

  // ==================== HANDLE WINDOW RESIZE ====================
  onWindowResize(camera) {
    if (!this.renderer || !camera) return;

    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (CONFIG.debug.enabled) {
      console.log(`📐 Window resized: ${window.innerWidth}x${window.innerHeight}`);
    }
  },

  // ==================== GET RENDERER INFO ====================
  getInfo() {
    if (!this.renderer) return null;

    return {
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      points: this.renderer.info.render.points,
      lines: this.renderer.info.render.lines,
      memory: {
        geometries: this.renderer.info.memory.geometries,
        textures: this.renderer.info.memory.textures
      }
    };
  },

  // ==================== DISPOSE ====================
  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      console.log('🗑️ Renderer disposed');
    }
  }
};

// Make globally available
window.Renderer = Renderer;