class EventBus {
  constructor() {
    this.events = {}
  }

  // Emit an event
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  // Listen to an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // Remove a listener
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  // Remove all listeners for an event
  offAll(event) {
    delete this.events[event]
  }
}

// Export a single instance
export const eventBus = new EventBus()