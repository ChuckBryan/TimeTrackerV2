/**
 * DOM Utilities
 * Collection of utility functions for DOM manipulation
 */

/**
 * Get element by ID with error handling
 * @param {string} id - Element ID to find
 * @returns {HTMLElement|null} - Element or null if not found
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID "${id}" not found.`);
  }
  return element;
}

/**
 * Get elements by selector with error handling
 * @param {string} selector - CSS selector
 * @returns {NodeList} - NodeList of matching elements
 */
export function getElements(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    console.warn(`No elements found matching selector "${selector}".`);
  }
  return elements;
}

/**
 * Add event listener with error handling
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} eventType - Type of event (e.g., 'click')
 * @param {Function} callback - Event handler function
 */
export function addEvent(element, eventType, callback) {
  if (!element) {
    console.warn("Cannot add event listener to undefined element.");
    return;
  }
  element.addEventListener(eventType, callback);
}

/**
 * Create an element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - HTML attributes as key-value pairs
 * @param {string|HTMLElement|Array} content - Inner content
 * @returns {HTMLElement} - Created element
 */
export function createElement(tag, attributes = {}, content = null) {
  const element = document.createElement(tag);

  // Add attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  // Add content
  if (content) {
    if (typeof content === "string") {
      element.textContent = content;
    } else if (content instanceof HTMLElement) {
      element.appendChild(content);
    } else if (Array.isArray(content)) {
      content.forEach((item) => {
        if (item instanceof HTMLElement) {
          element.appendChild(item);
        } else if (typeof item === "string") {
          element.appendChild(document.createTextNode(item));
        }
      });
    }
  }

  return element;
}

/**
 * Toggle class on element
 * @param {HTMLElement} element - Element to toggle class on
 * @param {string} className - Class to toggle
 * @param {boolean|undefined} force - Force add or remove
 * @returns {boolean} - Whether class is now present
 */
export function toggleClass(element, className, force) {
  if (!element) {
    console.warn("Cannot toggle class on undefined element.");
    return false;
  }
  return element.classList.toggle(className, force);
}

/**
 * Check if element has class
 * @param {HTMLElement} element - Element to check
 * @param {string} className - Class to look for
 * @returns {boolean} - Whether element has class
 */
export function hasClass(element, className) {
  if (!element) {
    console.warn("Cannot check class on undefined element.");
    return false;
  }
  return element.classList.contains(className);
}
