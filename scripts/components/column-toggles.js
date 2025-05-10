/**
 * Column Toggles Component
 * Handles toggling visibility of table columns for responsive views
 */

import { getElements, addEvent, toggleClass } from "../utils/dom-utils.js";

/**
 * Initialize the column toggle functionality for responsive tables
 */
export function initColumnToggles() {
  const toggleButtons = getElements(".column-toggle-button");

  // Skip if no toggle buttons found
  if (toggleButtons.length === 0) return;

  // Initialize columns state on page load based on screen size
  initializeColumnsState();

  // Add event listeners to toggle buttons
  toggleButtons.forEach((button) => {
    addEvent(button, "click", function () {
      toggleColumn(button);
    });
  });

  // Re-initialize on window resize
  addEvent(
    window,
    "resize",
    debounce(function () {
      initializeColumnsState();
    }, 250)
  );
}

/**
 * Initialize columns state on page load based on screen size
 */
function initializeColumnsState() {
  const toggleButtons = getElements(".column-toggle-button");

  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // On mobile, only hide status columns by default
    // Project ID columns should remain visible
    getElements(".status-column").forEach((col) => {
      col.classList.add("hidden-mobile");
    });

    // Hide day columns on mobile by default
    getElements(
      "th.day-column, td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6), td:nth-child(7), td:nth-child(8), td:nth-child(9)"
    ).forEach((col) => {
      col.style.display = "none";
    });

    // Update the toggle buttons state
    toggleButtons.forEach((button) => {
      // Keep Project ID button active, deactivate others
      if (button.getAttribute("data-column") === "project-id") {
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      }
    });
  } else {
    // On desktop, show all columns
    getElements("th, td").forEach((cell) => {
      cell.style.display = "";
    });
    getElements(".hidden-mobile").forEach((element) => {
      element.classList.remove("hidden-mobile");
    });

    // Set all toggle buttons to active
    toggleButtons.forEach((button) => {
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
    });
  }
}

/**
 * Toggle a specific column's visibility
 * @param {HTMLElement} button - The toggle button
 */
function toggleColumn(button) {
  const columnName = button.getAttribute("data-column");
  const isActive = toggleClass(button, "active");
  button.setAttribute("aria-pressed", isActive);

  if (columnName === "project-id") {
    toggleProjectIdColumn(isActive);
  } else if (columnName === "days") {
    toggleDayColumns(isActive);
  } else if (columnName === "status") {
    toggleStatusColumn(isActive);
  }
}

/**
 * Toggle Project ID column visibility
 * @param {boolean} show - Whether to show or hide
 */
function toggleProjectIdColumn(show) {
  getElements(".project-id-column, td:nth-child(1)").forEach((cell) => {
    cell.style.display = show ? "" : "none";
  });
}

/**
 * Toggle day columns visibility
 * @param {boolean} show - Whether to show or hide
 */
function toggleDayColumns(show) {
  getElements(
    "th.day-column, td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6), td:nth-child(7), td:nth-child(8), td:nth-child(9)"
  ).forEach((cell) => {
    cell.style.display = show ? "" : "none";
  });
}

/**
 * Toggle status column visibility
 * @param {boolean} show - Whether to show or hide
 */
function toggleStatusColumn(show) {
  getElements(".status-column").forEach((element) => {
    if (show) {
      element.classList.remove("hidden-mobile");
    } else {
      element.classList.add("hidden-mobile");
    }
  });
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
