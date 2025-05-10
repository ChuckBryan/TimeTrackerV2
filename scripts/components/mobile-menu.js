/**
 * Mobile Menu Component
 * Handles the mobile navigation functionality
 */

import {
  getElement,
  addEvent,
  toggleClass,
  hasClass,
} from "../utils/dom-utils.js";

/**
 * Initialize the mobile menu toggle functionality
 */
export function initMobileMenu() {
  const mobileMenuToggle = getElement("mobile-menu-toggle");
  const sidebar = getElement("sidebar");

  if (!mobileMenuToggle || !sidebar) return;

  // Toggle menu when button is clicked
  addEvent(mobileMenuToggle, "click", function () {
    toggleMenu(sidebar, mobileMenuToggle);
  });

  // Close menu when clicking outside
  addEvent(document, "click", function (event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);

    if (
      !isClickInsideSidebar &&
      !isClickOnToggle &&
      hasClass(sidebar, "active")
    ) {
      toggleMenu(sidebar, mobileMenuToggle, false);
    }
  });
}

/**
 * Toggle the mobile menu state
 * @param {HTMLElement} sidebar - The sidebar element
 * @param {HTMLElement} toggleButton - The toggle button element
 * @param {boolean|undefined} force - Force menu open or closed
 */
function toggleMenu(sidebar, toggleButton, force) {
  const isExpanded = toggleClass(sidebar, "active", force);
  toggleButton.setAttribute("aria-expanded", isExpanded);

  // Change icon based on state
  const icon = toggleButton.querySelector("i");
  if (icon) {
    if (isExpanded) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  }
}
