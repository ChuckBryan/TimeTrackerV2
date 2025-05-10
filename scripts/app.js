/**
 * Time Tracker Application
 * Main JavaScript entry point
 */

// Add global error handler for module loading issues
window.addEventListener("error", (event) => {
  if (event.message.includes("CORS") || event.message.includes("module")) {
    console.error(
      "🔴 Module loading error detected. Try using Live Server extension to fix CORS issues:",
      event.message
    );
  }
});

import { initCacheBuster } from "./utils/cache-buster.js";
import { initMobileMenu } from "./components/mobile-menu.js";
import { initColumnToggles } from "./components/column-toggles.js";
import { initTimeEntryDrawer } from "./components/time-entry-drawer.js";
import {
  initProjectCardExpansion,
  initProjectSearch,
  initProjectFilters,
} from "./components/projects.js";
import { initPreviousTimesheet } from "./components/previous-timesheet.js";
import { initPTO } from "./components/pto.js";

/**
 * Initialize the application based on current page
 */
function initApp() {
  try {
    // Initialize cache busting for all pages
    initCacheBuster();

    // Common components used across all pages
    initMobileMenu();

    // Initialize page-specific components based on current page
    const currentPage = getCurrentPage();

    console.log("Current page detected:", currentPage);
    // Initialize components based on the current page
    switch (currentPage) {
      case "index":
      case "timesheet":
        console.log("Initializing time entry drawer on index/timesheet page");
        initTimeEntryDrawer();
        initColumnToggles();
        break;

      case "previous-timesheet":
        initPreviousTimesheet();
        break;

      case "projects":
        initProjectCardExpansion();
        initProjectSearch();
        initProjectFilters();
        break;

      case "pto":
        initPTO();
        break;
    }
  } catch (error) {
    console.error("Error initializing application:", error);
  }
}

/**
 * Determine the current page based on URL or page-specific elements
 * @returns {string} - Current page identifier
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf("/") + 1);

  // Map filenames to page identifiers
  if (filename === "" || filename === "index.html") {
    return "index";
  } else if (filename === "previous-timesheet.html") {
    return "previous-timesheet";
  } else if (filename === "projects.html") {
    return "projects";
  } else if (filename === "pto.html") {
    return "pto";
  }

  // If we can't determine from URL, try to find page-specific elements
  if (document.getElementById("pto-calculator")) {
    return "pto";
  } else if (document.getElementById("projects-list")) {
    return "projects";
  } else if (document.getElementById("previous-timesheets")) {
    return "previous-timesheet";
  }

  // Default to index/timesheet page
  return "index";
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    initApp();
  } catch (error) {
    console.error("Error initializing application:", error);
  }
});

// Export these functions for potential use in inline scripts or testing
export { initApp, getCurrentPage };
