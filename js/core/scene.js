// ==================== SCENE MANAGEMENT ====================
// Three.js scene, camera, and lighting setup

const SceneManager = {
  // Three.js instances
  scene: null,
  camera: null,
  lights: {},

  // ==================== INITIALIZE SCENE ====================
  init() {
    console.log('🌍 Initializing Scene...');

    // Create scene
    this.scene = new THREE.Scene();

    // Add fog for depth
    if (CONFIG.visuals.enableFog) {
      this.scene.fog = new THREE.FogExp2(
        CONFIG.colors.background,
        CONFIG.world.fogDensity
      );
    }

    // Setup camera
    this.initCamera();

    // Setup lighting
    this.initLighting();

    console.log('✅ Scene initialized successfully');
    return true;
  },

  // ==================== INITIALIZE CAMERA ====================
  initCamera() {
    const { fov, near, far } = CONFIG.camera;
    const aspect = window.innerWidth / window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    // Set initial position
    const { x, y, z } = CONFIG.camera.initialPosition;
    this.camera.position.set(x, y, z);
    
    // Look at origin
    this.camera.lookAt(0, 0, 0);

    if (CONFIG.debug.enabled) {
      console.log('📷 Camera initialized at:', this.camera.position);
    }
  },

  // ==================== INITIALIZE LIGHTING ====================
  initLighting() {
    // Ambient light (overall illumination)
    this.lights.ambient = new THREE.AmbientLight(
      CONFIG.colors.primary,
      CONFIG.visuals.ambientLightIntensity
    );
    this.scene.add(this.lights.ambient);

    // Point light 1 (overhead cyan)
    this.lights.point1 = new THREE.PointLight(
      CONFIG.colors.primary,
      CONFIG.visuals.pointLight1Intensity,
      100
    );
    this.lights.point1.position.set(0, 20, 0);
    this.scene.add(this.lights.point1);

    // Point light 2 (side magenta)
    this.lights.point2 = new THREE.PointLight(
      CONFIG.colors.secondary,
      CONFIG.visuals.pointLight2Intensity,
      100
    );
    this.lights.point2.position.set(50, 15, 50);
    this.scene.add(this.lights.point2);

    // Optional: Add light helpers for debugging
    if (CONFIG.debug.enabled && CONFIG.debug.showStats) {
      const helper1 = new THREE.PointLightHelper(this.lights.point1, 2);
      const helper2 = new THREE.PointLightHelper(this.lights.point2, 2);
      this.scene.add(helper1);
      this.scene.add(helper2);
    }

    if (CONFIG.debug.enabled) {
      console.log('💡 Lighting initialized');
    }
  },

  // ==================== ADD OBJECT TO SCENE ====================
  add(object) {
    if (!this.scene) {
      console.error('❌ Scene not initialized');
      return false;
    }

    this.scene.add(object);
    return true;
  },

  // ==================== REMOVE OBJECT FROM SCENE ====================
  remove(object) {
    if (!this.scene) return false;
    this.scene.remove(object);
    return true;
  },

  // ==================== GET SCENE ====================
  getScene() {
    return this.scene;
  },

  // ==================== GET CAMERA ====================
  getCamera() {
    return this.camera;
  },

  // ==================== UPDATE CAMERA FOLLOW ====================
  updateCamera(targetPosition, targetRotation) {
    if (!this.camera) return;

    // Calculate ideal camera position based on bike rotation
    const offset = new THREE.Vector3(
      CONFIG.bike.cameraOffset.x,
      CONFIG.bike.cameraOffset.y,
      CONFIG.bike.cameraOffset.z
    );

    // Rotate offset by bike rotation
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);

    // Calculate ideal position
    const idealPosition = new THREE.Vector3(
      targetPosition.x + offset.x,
      targetPosition.y + offset.y,
      targetPosition.z + offset.z
    );

    // Smooth lerp to ideal position
    this.camera.position.lerp(idealPosition, CONFIG.bike.cameraLerpSpeed);

    // Look at bike (slightly above it)
    const lookAtTarget = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y + 2,
      targetPosition.z
    );
    this.camera.lookAt(lookAtTarget);
  },

  // ==================== ANIMATE LIGHTS ====================
  animateLights(time) {
    if (!this.lights.point2) return;

    // Subtle light movement for dynamic feel
    this.lights.point2.position.x = 50 + Math.sin(time * 0.5) * 10;
    this.lights.point2.position.z = 50 + Math.cos(time * 0.5) * 10;
  },

  // ==================== GET SCENE INFO ====================
  getInfo() {
    if (!this.scene) return null;

    return {
      children: this.scene.children.length,
      fog: this.scene.fog ? 'enabled' : 'disabled',
      lights: Object.keys(this.lights).length,
      camera: {
        position: this.camera.position,
        rotation: this.camera.rotation
      }
    };
  },

  // ==================== DISPOSE ====================
  dispose() {
    if (this.scene) {
      // Remove all objects
      while (this.scene.children.length > 0) {
        const object = this.scene.children[0];
        this.scene.remove(object);
        
        // Dispose geometry and material
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }

      console.log('🗑️ Scene disposed');
    }
  }
};

// Make globally available
window.SceneManager = SceneManager;