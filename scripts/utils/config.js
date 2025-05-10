/**
 * Configuration settings for CoPilotVision
 * Central place for application configuration
 */

const config = {
  /**
   * Application settings
   */
  app: {
    name: "CoPilotVision",
    version: "1.0.0",
    copyrightYear: 2025,
    companyName: "Marathon Consulting, LLC",
  },

  /**
   * UI settings
   */
  ui: {
    // Animation durations in milliseconds
    animations: {
      drawerOpenDuration: 300,
      messageDisplayDuration: 3000,
    },
    // Default visible columns
    columns: {
      mobileDefaultVisible: ["project-id"],
      desktopDefaultVisible: ["project-id", "status-report", "day-columns"],
    },
    // Responsive breakpoints
    breakpoints: {
      mobile: 768,
      smallMobile: 480,
    },
  },

  /**
   * API settings (for future use)
   */
  api: {
    baseUrl: "/api",
    timeout: 30000,
    retryAttempts: 3,
  },

  /**
   * Date formatting settings
   */
  dates: {
    defaultFormat: "MM/dd/yy",
    displayFormat: "dddd, MM/dd/yy",
  },

  /**
   * Feature flags for enabling/disabling features
   */
  features: {
    enableNotifications: true,
    enableOfflineMode: false,
    debugMode:
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1",
  },
};

// Freeze the config to prevent accidental modifications
Object.freeze(config);

export default config;
