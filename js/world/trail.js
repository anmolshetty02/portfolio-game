// ==================== LIGHT TRAIL ====================
// TRON-style light trail behind the bike

const Trail = {
  // Trail settings
  enabled: CONFIG.visuals.enableTrails,
  maxLength: CONFIG.visuals.trailLength,

  // Trail data
  positions: [],
  mesh: null,
  geometry: null,
  material: null,

  // ==================== CREATE TRAIL ====================
  create() {
    if (!this.enabled) {
      console.log('⚠️ Trails disabled in config');
      return false;
    }

    console.log('✨ Creating trail...');

    // Initialize positions array
    this.positions = [];

    // Create geometry
    this.geometry = new THREE.BufferGeometry();

    // Create material
    this.material = new THREE.LineBasicMaterial({
      color: CONFIG.colors.primary,
      transparent: true,
      opacity: CONFIG.visuals.trailOpacity,
      linewidth: 2 // Note: linewidth > 1 only works on some platforms
    });

    // Create mesh
    this.mesh = new THREE.Line(this.geometry, this.material);

    // Add to scene
    if (window.SceneManager) {
      window.SceneManager.add(this.mesh);
    }

    console.log('✅ Trail created');
    return true;
  },

  // ==================== UPDATE TRAIL ====================
  update() {
    if (!this.enabled || !window.Bike) return;

    // Get bike position
    const bikePos = window.Bike.getPosition();

    // Only add position if bike is moving
    if (window.Bike.isMovingState()) {
      // Add current position
      this.positions.push(bikePos.clone());

      // Limit trail length
      if (this.positions.length > this.maxLength) {
        this.positions.shift();
      }
    }

    // Update geometry
    this.updateGeometry();
  },

  // ==================== UPDATE GEOMETRY ====================
  updateGeometry() {
    if (!this.geometry || this.positions.length < 2) return;

    // Create array of vertices
    const vertices = [];

    this.positions.forEach(pos => {
      vertices.push(pos.x, pos.y, pos.z);
    });

    // Update geometry
    const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
    this.geometry.setAttribute('position', positionAttribute);
    this.geometry.setDrawRange(0, this.positions.length);

    // Update opacity based on position in trail (fade out at end)
    if (this.material) {
      const colors = [];
      this.positions.forEach((pos, index) => {
        const opacity = index / this.positions.length;
        colors.push(opacity, opacity, opacity);
      });

      // Note: For gradient effect, we'd need a different material
      // For now, trail has uniform opacity
    }
  },

  // ==================== CLEAR TRAIL ====================
  clear() {
    this.positions = [];
    if (this.geometry) {
      this.geometry.setDrawRange(0, 0);
    }
    console.log('🗑️ Trail cleared');
  },

  // ==================== ENABLE/DISABLE ====================
  enable() {
    this.enabled = true;
    if (this.mesh) {
      this.mesh.visible = true;
    }
  },

  disable() {
    this.enabled = false;
    if (this.mesh) {
      this.mesh.visible = false;
    }
    this.clear();
  },

  // ==================== TOGGLE ====================
  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  },

  // ==================== DISPOSE ====================
  dispose() {
    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (this.mesh && window.SceneManager) {
      window.SceneManager.remove(this.mesh);
    }

    this.positions = [];

    console.log('🗑️ Trail disposed');
  }
};

// Make globally available
window.Trail = Trail;