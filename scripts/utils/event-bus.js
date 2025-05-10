/**
 * Event Bus for CoPilotVision
 * Allows components to communicate without direct dependencies
 */

class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} [context] - Context to bind callback to
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    const listener = { callback, context };
    this.events[event].push(listener);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Remove event subscription
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(
      (listener) => listener.callback !== callback
    );

    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  /**
   * Emit an event with data
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (!this.events[event]) return;

    this.events[event].forEach((listener) => {
      try {
        listener.callback.call(listener.context, data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Clear all event subscriptions
   */
  clear() {
    this.events = {};
  }
}

// Create a singleton instance
const eventBus = new EventBus();

// Example events
export const EVENTS = {
  // App lifecycle events
  APP_INITIALIZED: "app:initialized",

  // Time entry events
  TIME_ENTRY_SAVED: "timeEntry:saved",
  TIME_ENTRY_DRAWER_OPENED: "timeEntry:drawerOpened",
  TIME_ENTRY_DRAWER_CLOSED: "timeEntry:drawerClosed",

  // Data events
  DATA_LOADED: "data:loaded",
  DATA_CHANGED: "data:changed",

  // UI events
  UI_THEME_CHANGED: "ui:themeChanged",
  UI_LAYOUT_CHANGED: "ui:layoutChanged",

  // Navigation events
  NAV_PAGE_CHANGED: "nav:pageChanged",
};

export default eventBus;
