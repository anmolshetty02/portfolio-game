// ==================== GRID WORLD ====================
// Creates the iconic TRON-style neon grid floor

const Grid = {
  // Grid objects
  gridHelper: null,
  floor: null,
  
  // Animation
  time: 0,

  // ==================== CREATE GRID ====================
  create() {
    console.log('🌐 Creating grid...');

    // Create grid helper (the lines)
    this.createGridHelper();

    // Create animated floor plane
    this.createFloor();

    console.log('✅ Grid created');
    return true;
  },

  // ==================== CREATE GRID HELPER ====================
  createGridHelper() {
    const { gridSize, gridDivisions } = CONFIG.world;

    // Create grid with two colors
    this.gridHelper = new THREE.GridHelper(
      gridSize,
      gridDivisions,
      CONFIG.colors.gridPrimary,
      CONFIG.colors.gridSecondary
    );

    // Make it slightly transparent
    this.gridHelper.material.opacity = 0.3;
    this.gridHelper.material.transparent = true;

    // Add to scene
    if (window.SceneManager) {
      window.SceneManager.add(this.gridHelper);
    }
  },

  // ==================== CREATE FLOOR ====================
  createFloor() {
    const { gridSize, gridDivisions } = CONFIG.world;

    // Create plane geometry with subdivisions for animation
    const geometry = new THREE.PlaneGeometry(
      gridSize,
      gridSize,
      gridDivisions,
      gridDivisions
    );

    // Create wireframe material
    const material = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.floorBase,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });

    // Create mesh
    this.floor = new THREE.Mesh(geometry, material);

    // Rotate to be horizontal
    this.floor.rotation.x = -Math.PI / 2;

    // Position slightly below grid
    this.floor.position.y = -0.1;

    // Add to scene
    if (window.SceneManager) {
      window.SceneManager.add(this.floor);
    }
  },

  // ==================== UPDATE (ANIMATE) ====================
  update(deltaTime, elapsedTime) {
    this.time = elapsedTime;

    // Animate floor opacity (pulsing effect)
    if (this.floor) {
      this.floor.material.opacity = 0.2 + Math.sin(this.time) * 0.1;
    }

    // Optional: Animate grid vertices for wave effect
    if (this.floor && CONFIG.visuals.enableGlow) {
      const positions = this.floor.geometry.attributes.position;
      const time = this.time * 0.5;

      // Create subtle wave effect
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Calculate wave
        const distance = Math.sqrt(x * x + y * y);
        const wave = Math.sin(distance * 0.1 - time) * 0.5;
        
        // Apply subtle displacement
        positions.setZ(i, wave * 0.1);
      }

      positions.needsUpdate = true;
    }
  },

  // ==================== GET FLOOR HEIGHT AT POSITION ====================
  getHeightAt(x, z) {
    // For now, floor is flat at y = 0
    // Could be extended for terrain height
    return 0;
  },

  // ==================== DISPOSE ====================
  dispose() {
    if (this.gridHelper) {
      this.gridHelper.geometry.dispose();
      this.gridHelper.material.dispose();
      if (window.SceneManager) {
        window.SceneManager.remove(this.gridHelper);
      }
    }

    if (this.floor) {
      this.floor.geometry.dispose();
      this.floor.material.dispose();
      if (window.SceneManager) {
        window.SceneManager.remove(this.floor);
      }
    }

    console.log('🗑️ Grid disposed');
  }
};

// Make globally available
window.Grid = Grid;