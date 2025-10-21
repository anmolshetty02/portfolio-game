// ==================== OVERLAYS ====================
// Manages portfolio content overlays (About, Projects, etc.)

const Overlays = {
  // Container
  container: null,

  // Active overlay
  activeOverlay: null,

  // Loaded overlays cache
  loadedOverlays: {},

  // ==================== INITIALIZE ====================
  init() {
    console.log('📋 Initializing Overlays...');

    // Get container
    this.container = document.getElementById('overlay-container');

    if (!this.container) {
      console.error('❌ Overlay container not found');
      return false;
    }

    // Setup global close function
    window.closeOverlay = (overlayId) => this.close(overlayId);

    console.log('✅ Overlays initialized');
    return true;
  },

  // ==================== OPEN OVERLAY ====================
  async open(overlayId) {
    console.log(`📋 Opening overlay: ${overlayId}`);

    try {
      // Load overlay HTML if not cached
      if (!this.loadedOverlays[overlayId]) {
        await this.loadOverlay(overlayId);
      }

      // Get overlay element
      const overlay = document.getElementById(`overlay-${overlayId}`);

      if (!overlay) {
        console.error(`❌ Overlay not found: ${overlayId}`);
        return false;
      }

      // Show overlay
      overlay.classList.add('active');
      this.activeOverlay = overlayId;

      // Pause game
      if (window.GameState) {
        window.GameState.pause();
      }

      return true;

    } catch (error) {
      console.error(`❌ Failed to open overlay ${overlayId}:`, error);
      return false;
    }
  },

  // ==================== CLOSE OVERLAY ====================
  close(overlayId) {
    console.log(`📋 Closing overlay: ${overlayId}`);

    // Get overlay element
    const overlay = document.getElementById(`overlay-${overlayId}`);

    if (!overlay) {
      console.warn(`⚠️ Overlay not found: ${overlayId}`);
      return false;
    }

    // Hide overlay
    overlay.classList.remove('active');

    // Clear active overlay
    if (this.activeOverlay === overlayId) {
      this.activeOverlay = null;
    }

    // Resume game
    if (window.GameState) {
      window.GameState.resume();
    }

    return true;
  },

  // ==================== CLOSE ALL ====================
  closeAll() {
    Object.keys(this.loadedOverlays).forEach(overlayId => {
      this.close(overlayId);
    });

    console.log('📋 All overlays closed');
  },

  // ==================== LOAD OVERLAY HTML ====================
  async loadOverlay(overlayId) {
    console.log(`📋 Loading overlay HTML: ${overlayId}`);

    try {
      // Load HTML from file
      let html = null;

      if (window.DataLoader) {
        html = await window.DataLoader.loadOverlay(overlayId);
      }

      if (!html) {
        // Fallback: create basic overlay
        html = this.createFallbackOverlay(overlayId);
      }

      // Create overlay element
      const overlayDiv = document.createElement('div');
      overlayDiv.id = `overlay-${overlayId}`;
      overlayDiv.className = 'overlay';
      overlayDiv.innerHTML = html;

      // Add to container
      this.container.appendChild(overlayDiv);

      // Mark as loaded
      this.loadedOverlays[overlayId] = true;

      // Inject dynamic content
      this.injectDynamicContent(overlayId, overlayDiv);

      console.log(`✅ Overlay loaded: ${overlayId}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to load overlay ${overlayId}:`, error);
      return false;
    }
  },

  // ==================== CREATE FALLBACK OVERLAY ====================
  createFallbackOverlay(overlayId) {
    const title = overlayId.toUpperCase();
    
    return `
      <div class="overlay-header">
        <h2>${title}</h2>
        <button class="overlay-close" onclick="closeOverlay('${overlayId}')">×</button>
      </div>
      <div class="overlay-body">
        <p>Content for ${overlayId} overlay.</p>
        <p>HTML file not found at: ${CONFIG.overlays[overlayId] || 'undefined'}</p>
      </div>
    `;
  },

  // ==================== INJECT DYNAMIC CONTENT ====================
  injectDynamicContent(overlayId, overlayElement) {
    // Inject data from JSON files based on overlay type
    
    switch(overlayId) {
      case 'about':
        this.injectAboutContent(overlayElement);
        break;
      
      case 'projects':
        this.injectProjectsContent(overlayElement);
        break;
      
      case 'experience':
        this.injectExperienceContent(overlayElement);
        break;
      
      case 'skills':
        this.injectSkillsContent(overlayElement);
        break;
      
      case 'contact':
        this.injectContactContent(overlayElement);
        break;
    }
  },

  // ==================== INJECT ABOUT CONTENT ====================
  injectAboutContent(element) {
    if (!window.DataLoader) return;
    
    const profile = window.DataLoader.getProfile();
    if (!profile) return;

    // Could dynamically update content here
    // For MVP, HTML files contain static content
  },

  // ==================== INJECT PROJECTS CONTENT ====================
  injectProjectsContent(element) {
    if (!window.DataLoader) return;
    
    const projects = window.DataLoader.getProjects();
    if (!projects) return;

    // Could dynamically generate project cards here
  },

  // ==================== INJECT EXPERIENCE CONTENT ====================
  injectExperienceContent(element) {
    if (!window.DataLoader) return;
    
    const experience = window.DataLoader.getExperience();
    if (!experience) return;

    // Could dynamically generate experience timeline here
  },

  // ==================== INJECT SKILLS CONTENT ====================
  injectSkillsContent(element) {
    if (!window.DataLoader) return;
    
    const skills = window.DataLoader.getSkills();
    if (!skills) return;

    // Could dynamically generate skill categories here
  },

  // ==================== INJECT CONTACT CONTENT ====================
  injectContactContent(element) {
    if (!window.DataLoader) return;
    
    const profile = window.DataLoader.getProfile();
    if (!profile) return;

    // Could dynamically update contact info here
  },

  // ==================== IS OVERLAY OPEN ====================
  isOpen(overlayId) {
    return this.activeOverlay === overlayId;
  },

  // ==================== GET ACTIVE OVERLAY ====================
  getActive() {
    return this.activeOverlay;
  },

  // ==================== GET INFO ====================
  getInfo() {
    return {
      activeOverlay: this.activeOverlay,
      loadedOverlays: Object.keys(this.loadedOverlays),
      totalLoaded: Object.keys(this.loadedOverlays).length
    };
  }
};

// Make globally available
window.Overlays = Overlays;