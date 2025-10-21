// ==================== BIKE (PLAYER) ====================
// Player-controlled vehicle with physics and movement

const Bike = {
  // Three.js objects
  mesh: null,
  glowMesh: null,

  // Physics
  position: new THREE.Vector3(),
  velocity: new THREE.Vector3(),
  rotation: 0,

  // Movement state
  isMoving: false,
  isSprinting: false,

  // ==================== CREATE BIKE ====================
  create() {
    console.log('🏍️ Creating bike...');

    // Create bike mesh (box for now)
    this.createMesh();

    // Create glow effect
    this.createGlow();

    // Set initial position
    const start = CONFIG.bike.startPosition;
    this.position.set(start.x, start.y, start.z);
    this.mesh.position.copy(this.position);

    console.log('✅ Bike created');
    return true;
  },

  // ==================== CREATE MESH ====================
  createMesh() {
    // Create geometry (simple box for MVP)
    const geometry = new THREE.BoxGeometry(2, 1, 4);

    // Create material with emissive glow
    const material = new THREE.MeshPhongMaterial({
      color: CONFIG.colors.primary,
      emissive: CONFIG.colors.primary,
      emissiveIntensity: 0.5,
      shininess: 100
    });

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, material);

    // Add to scene
    if (window.SceneManager) {
      window.SceneManager.add(this.mesh);
    }
  },

  // ==================== CREATE GLOW ====================
  createGlow() {
    // Create slightly larger box for glow effect
    const geometry = new THREE.BoxGeometry(2.2, 1.2, 4.2);

    const material = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.primary,
      transparent: true,
      opacity: 0.3
    });

    this.glowMesh = new THREE.Mesh(geometry, material);

    // Add as child of bike
    this.mesh.add(this.glowMesh);
  },

  // ==================== UPDATE ====================
  update(deltaTime) {
    if (!window.InputManager) return;

    // Get input state
    const input = window.InputManager.getInputSummary();

    // Calculate movement
    this.updateRotation(input);
    this.updateMovement(input, deltaTime);
    this.updatePosition();

    // Update mesh transform
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation;

    // Update camera to follow bike
    if (window.SceneManager) {
      window.SceneManager.updateCamera(this.position, this.rotation);
    }

    // Check zone triggers
    if (window.Zones) {
      window.Zones.checkTriggers(this.position);
    }
  },

  // ==================== UPDATE ROTATION ====================
  updateRotation(input) {
    const rotSpeed = CONFIG.bike.rotationSpeed;

    if (input.left) {
      this.rotation += rotSpeed;
    }

    if (input.right) {
      this.rotation -= rotSpeed;
    }
  },

  // ==================== UPDATE MOVEMENT ====================
  updateMovement(input, deltaTime) {
    // Determine speed
    const speed = input.sprint ? CONFIG.bike.sprintSpeed : CONFIG.bike.speed;
    this.isSprinting = input.sprint;

    // Calculate direction based on input
    const direction = new THREE.Vector3();

    if (input.forward) {
      direction.z -= 1;
    }

    if (input.backward) {
      direction.z += 1;
    }

    // Check if moving
    this.isMoving = direction.length() > 0;

    if (this.isMoving) {
      // Normalize direction
      direction.normalize();

      // Rotate direction by bike rotation
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);

      // Apply speed
      direction.multiplyScalar(speed);

      // Smooth acceleration
      this.velocity.lerp(direction, CONFIG.bike.acceleration);
    } else {
      // Smooth deceleration
      this.velocity.lerp(new THREE.Vector3(), CONFIG.bike.deceleration);
    }
  },

  // ==================== UPDATE POSITION ====================
  updatePosition() {
    // Apply velocity to position
    this.position.add(this.velocity);

    // Keep bike within boundaries
    const boundary = CONFIG.world.boundaryLimit;

    if (!CONFIG.debug.godMode) {
      this.position.x = Math.max(-boundary, Math.min(boundary, this.position.x));
      this.position.z = Math.max(-boundary, Math.min(boundary, this.position.z));
    }

    // Keep bike on ground (with slight hover)
    this.position.y = CONFIG.bike.startPosition.y;
  },

  // ==================== GET POSITION ====================
  getPosition() {
    return this.position.clone();
  },

  // ==================== GET ROTATION ====================
  getRotation() {
    return this.rotation;
  },

  // ==================== GET VELOCITY ====================
  getVelocity() {
    return this.velocity.clone();
  },

  // ==================== IS MOVING ====================
  isMovingState() {
    return this.isMoving;
  },

  // ==================== RESET POSITION ====================
  resetPosition() {
    const start = CONFIG.bike.startPosition;
    this.position.set(start.x, start.y, start.z);
    this.velocity.set(0, 0, 0);
    this.rotation = 0;

    console.log('🔄 Bike position reset');
  },

  // ==================== GET INFO ====================
  getInfo() {
    return {
      position: {
        x: this.position.x.toFixed(2),
        y: this.position.y.toFixed(2),
        z: this.position.z.toFixed(2)
      },
      rotation: this.rotation.toFixed(2),
      velocity: {
        x: this.velocity.x.toFixed(2),
        y: this.velocity.y.toFixed(2),
        z: this.velocity.z.toFixed(2)
      },
      isMoving: this.isMoving,
      isSprinting: this.isSprinting
    };
  },

  // ==================== DISPOSE ====================
  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      
      if (this.glowMesh) {
        this.glowMesh.geometry.dispose();
        this.glowMesh.material.dispose();
      }

      if (window.SceneManager) {
        window.SceneManager.remove(this.mesh);
      }
    }

    console.log('🗑️ Bike disposed');
  }
};

// Make globally available
window.Bike = Bike;