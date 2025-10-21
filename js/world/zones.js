// ==================== ZONES ====================
// Interactive zone markers that trigger portfolio overlays

const Zones = {
  // Zone data and objects
  zones: [],
  markers: [],
  labels: [],

  // Animation
  time: 0,

  // ==================== CREATE ZONES ====================
  async create() {
    console.log('🎯 Creating zones...');

    // Get zone data
    const zoneData = window.DataLoader ? window.DataLoader.getZones() : null;

    if (!zoneData || !zoneData.zones) {
      console.error('❌ No zone data available');
      return false;
    }

    // Create each zone
    zoneData.zones.forEach(zone => {
      this.createZone(zone);
    });

    console.log(`✅ Created ${this.zones.length} zones`);
    return true;
  },

  // ==================== CREATE SINGLE ZONE ====================
  createZone(zoneData) {
    // Create marker (cylinder platform)
    const marker = this.createMarker(zoneData);

    // Create label (floating text indicator)
    const label = this.createLabel(zoneData);

    // Store zone data
    this.zones.push({
      data: zoneData,
      marker: marker,
      label: label,
      triggered: false
    });

    this.markers.push(marker);
    this.labels.push(label);
  },

  // ==================== CREATE MARKER ====================
  createMarker(zoneData) {
    const { radius } = CONFIG.zones;
    const height = CONFIG.zones.markerHeight;

    // Create geometry
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      32
    );

    // Parse color from hex string
    const color = parseInt(zoneData.color.replace('#', '0x'));

    // Create material with glow
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6
    });

    // Create mesh
    const marker = new THREE.Mesh(geometry, material);

    // Set position
    marker.position.set(
      zoneData.position.x,
      zoneData.position.y,
      zoneData.position.z
    );

    // Store zone data reference
    marker.userData = { zoneData };

    // Add to scene
    if (window.SceneManager) {
      window.SceneManager.add(marker);
    }

    return marker;
  },

  // ==================== CREATE LABEL ====================
  createLabel(zoneData) {
    // Create simple box as label placeholder
    // In production, this could be a sprite with text texture
    const geometry = new THREE.BoxGeometry(10, 5, 0.1);

    // Parse color
    const color = parseInt(zoneData.color.replace('#', '0x'));

    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });

    const label = new THREE.Mesh(geometry, material);

    // Position above marker
    label.position.set(
      zoneData.position.x,
      CONFIG.zones.labelHeight,
      zoneData.position.z
    );

    // Store zone data
    label.userData = { zoneData };

    // Add to scene
    if (window.SceneManager) {
      window.SceneManager.add(label);
    }

    return label;
  },

  // ==================== UPDATE ====================
  update(deltaTime, elapsedTime) {
    this.time = elapsedTime;

    // Animate markers and labels
    this.markers.forEach((marker, index) => {
      // Rotate marker
      marker.rotation.y += CONFIG.zones.rotationSpeed;

      // Animate label (floating)
      const label = this.labels[index];
      if (label) {
        const offset = Math.sin(this.time + marker.position.x) * CONFIG.zones.labelFloatAmplitude;
        label.position.y = CONFIG.zones.labelHeight + offset;

        // Make label face camera
        if (window.SceneManager && window.SceneManager.camera) {
          label.rotation.y = window.SceneManager.camera.rotation.y;
        }
      }
    });
  },

  // ==================== CHECK TRIGGERS ====================
  checkTriggers(bikePosition) {
    if (!window.GameState || !window.Triggers) return;

    this.zones.forEach(zone => {
      // Calculate distance from bike to zone
      const distance = bikePosition.distanceTo(zone.marker.position);

      // Check if within trigger distance
      if (distance < CONFIG.zones.triggerDistance) {
        // Trigger zone if not already triggered
        if (!zone.triggered) {
          this.triggerZone(zone);
        }
      }
    });

    // Update current zone in HUD
    this.updateCurrentZone(bikePosition);
  },

  // ==================== TRIGGER ZONE ====================
  triggerZone(zone) {
    console.log('🎯 Zone triggered:', zone.data.name);

    // Mark as triggered
    zone.triggered = true;

    // Call trigger handler
    if (window.Triggers) {
      window.Triggers.onZoneEnter(zone.data);
    }
  },

  // ==================== UPDATE CURRENT ZONE ====================
  updateCurrentZone(bikePosition) {
    let currentZone = null;
    let closestDistance = Infinity;

    // Find closest zone
    this.zones.forEach(zone => {
      const distance = bikePosition.distanceTo(zone.marker.position);
      
      if (distance < CONFIG.zones.triggerDistance && distance < closestDistance) {
        closestDistance = distance;
        currentZone = zone.data;
      }
    });

    // Update HUD
    if (window.HUD) {
      if (currentZone) {
        window.HUD.updateZone(currentZone.name, currentZone.subtitle);
      } else {
        window.HUD.updateZone('EXPLORATION MODE', 'Navigate to zones to unlock content');
      }
    }
  },

  // ==================== GET ZONE BY ID ====================
  getZoneById(zoneId) {
    return this.zones.find(z => z.data.id === zoneId);
  },

  // ==================== GET ALL ZONES ====================
  getAllZones() {
    return this.zones.map(z => z.data);
  },

  // ==================== RESET TRIGGERS ====================
  resetTriggers() {
    this.zones.forEach(zone => {
      zone.triggered = false;
    });
    console.log('🔄 Zone triggers reset');
  },

  // ==================== DISPOSE ====================
  dispose() {
    // Dispose markers
    this.markers.forEach(marker => {
      marker.geometry.dispose();
      marker.material.dispose();
      if (window.SceneManager) {
        window.SceneManager.remove(marker);
      }
    });

    // Dispose labels
    this.labels.forEach(label => {
      label.geometry.dispose();
      label.material.dispose();
      if (window.SceneManager) {
        window.SceneManager.remove(label);
      }
    });

    this.zones = [];
    this.markers = [];
    this.labels = [];

    console.log('🗑️ Zones disposed');
  }
};

// Make globally available
window.Zones = Zones;