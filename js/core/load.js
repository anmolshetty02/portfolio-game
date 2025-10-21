// ==================== DATA LOADER ====================
// Handles loading JSON data and HTML overlays

const DataLoader = {
  // Cached data
  cache: {
    zones: null,
    profile: null,
    projects: null,
    experience: null,
    skills: null,
    overlays: {}
  },

  // Loading state
  isLoading: false,
  loadProgress: 0,

  // ==================== LOAD ALL DATA ====================
  async loadAll() {
    console.log('📦 Loading all data...');
    this.isLoading = true;
    this.loadProgress = 0;

    try {
      const totalItems = 5; // zones, profile, projects, experience, skills
      let loadedItems = 0;

      // Load zones
      this.cache.zones = await this.loadJSON(CONFIG.data.zones);
      loadedItems++;
      this.loadProgress = (loadedItems / totalItems) * 100;
      this.updateLoadingBar();

      // Load profile
      this.cache.profile = await this.loadJSON(CONFIG.data.profile);
      loadedItems++;
      this.loadProgress = (loadedItems / totalItems) * 100;
      this.updateLoadingBar();

      // Load projects
      this.cache.projects = await this.loadJSON(CONFIG.data.projects);
      loadedItems++;
      this.loadProgress = (loadedItems / totalItems) * 100;
      this.updateLoadingBar();

      // Load experience
      this.cache.experience = await this.loadJSON(CONFIG.data.experience);
      loadedItems++;
      this.loadProgress = (loadedItems / totalItems) * 100;
      this.updateLoadingBar();

      // Load skills
      this.cache.skills = await this.loadJSON(CONFIG.data.skills);
      loadedItems++;
      this.loadProgress = (loadedItems / totalItems) * 100;
      this.updateLoadingBar();

      console.log('✅ All data loaded successfully');
      this.isLoading = false;
      return true;

    } catch (error) {
      console.error('❌ Failed to load data:', error);
      this.isLoading = false;
      return false;
    }
  },

  // ==================== LOAD JSON FILE ====================
  async loadJSON(path) {
    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (CONFIG.debug.enabled) {
        console.log(`📄 Loaded: ${path}`, data);
      }
      
      return data;

    } catch (error) {
      console.error(`❌ Failed to load ${path}:`, error);
      throw error;
    }
  },

  // ==================== LOAD HTML OVERLAY ====================
  async loadOverlay(overlayId) {
    // Check cache first
    if (this.cache.overlays[overlayId]) {
      return this.cache.overlays[overlayId];
    }

    const path = CONFIG.overlays[overlayId];
    
    if (!path) {
      console.error(`❌ No path defined for overlay: ${overlayId}`);
      return null;
    }

    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Cache it
      this.cache.overlays[overlayId] = html;
      
      if (CONFIG.debug.enabled) {
        console.log(`📄 Loaded overlay: ${overlayId}`);
      }
      
      return html;

    } catch (error) {
      console.error(`❌ Failed to load overlay ${overlayId}:`, error);
      return null;
    }
  },

  // ==================== UPDATE LOADING BAR ====================
  updateLoadingBar() {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      progressBar.style.width = this.loadProgress + '%';
    }
  },

  // ==================== GET DATA ====================
  getZones() {
    return this.cache.zones;
  },

  getProfile() {
    return this.cache.profile;
  },

  getProjects() {
    return this.cache.projects;
  },

  getExperience() {
    return this.cache.experience;
  },

  getSkills() {
    return this.cache.skills;
  },

  getOverlay(overlayId) {
    return this.cache.overlays[overlayId];
  },

  // ==================== CHECK IF LOADED ====================
  isDataLoaded() {
    return (
      this.cache.zones !== null &&
      this.cache.profile !== null &&
      this.cache.projects !== null &&
      this.cache.experience !== null &&
      this.cache.skills !== null
    );
  },

  // ==================== GET LOAD PROGRESS ====================
  getLoadProgress() {
    return this.loadProgress;
  },

  // ==================== CLEAR CACHE ====================
  clearCache() {
    this.cache = {
      zones: null,
      profile: null,
      projects: null,
      experience: null,
      skills: null,
      overlays: {}
    };
    console.log('🗑️ Data cache cleared');
  }
};

// Make globally available
window.DataLoader = DataLoader;