// ==================== TOAST NOTIFICATIONS ====================
// Temporary notification messages (zone discovered, XP gained, etc.)

const Toasts = {
  // Container
  container: null,

  // Active toasts
  activeToasts: [],

  // Queue
  queue: [],
  maxToasts: 3,

  // ==================== INITIALIZE ====================
  init() {
    console.log('🍞 Initializing Toasts...');

    // Get or create container
    this.container = document.getElementById('toast-container');

    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }

    console.log('✅ Toasts initialized');
    return true;
  },

  // ==================== SHOW TOAST ====================
  show(title, message, type = 'info', duration = CONFIG.ui.toastDuration) {
    // Create toast data
    const toast = {
      id: Date.now() + Math.random(),
      title,
      message,
      type,
      duration
    };

    // Check if too many toasts
    if (this.activeToasts.length >= this.maxToasts) {
      this.queue.push(toast);
      return;
    }

    // Display toast
    this.display(toast);
  },

  // ==================== DISPLAY TOAST ====================
  display(toast) {
    console.log(`🍞 Showing toast: ${toast.title}`);

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = `toast toast-${toast.type}`;
    toastElement.id = `toast-${toast.id}`;

    // Set inner HTML
    toastElement.innerHTML = `
      <div class="toast-title">${toast.title}</div>
      ${toast.message ? `<div class="toast-message">${toast.message}</div>` : ''}
    `;

    // Add to container
    this.container.appendChild(toastElement);

    // Add to active toasts
    this.activeToasts.push(toast);

    // Trigger animation
    setTimeout(() => {
      toastElement.classList.add('toast-show');
    }, 10);

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(toast.id);
    }, toast.duration);
  },

  // ==================== REMOVE TOAST ====================
  remove(toastId) {
    const toastElement = document.getElementById(`toast-${toastId}`);

    if (!toastElement) return;

    // Fade out animation
    toastElement.classList.remove('toast-show');
    toastElement.classList.add('toast-hide');

    // Remove from DOM after animation
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }

      // Remove from active toasts
      this.activeToasts = this.activeToasts.filter(t => t.id !== toastId);

      // Show queued toast if any
      if (this.queue.length > 0) {
        const nextToast = this.queue.shift();
        this.display(nextToast);
      }
    }, 300);
  },

  // ==================== SHOW SUCCESS ====================
  success(title, message, duration) {
    this.show(title, message, 'success', duration);
  },

  // ==================== SHOW ERROR ====================
  error(title, message, duration) {
    this.show(title, message, 'error', duration);
  },

  // ==================== SHOW WARNING ====================
  warning(title, message, duration) {
    this.show(title, message, 'warning', duration);
  },

  // ==================== SHOW INFO ====================
  info(title, message, duration) {
    this.show(title, message, 'info', duration);
  },

  // ==================== CLEAR ALL ====================
  clearAll() {
    this.activeToasts.forEach(toast => {
      this.remove(toast.id);
    });

    this.queue = [];
    console.log('🗑️ All toasts cleared');
  },

  // ==================== GET INFO ====================
  getInfo() {
    return {
      active: this.activeToasts.length,
      queued: this.queue.length,
      maxToasts: this.maxToasts
    };
  }
};

// Make globally available
window.Toasts = Toasts;