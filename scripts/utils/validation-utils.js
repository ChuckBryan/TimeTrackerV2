/**
 * Validation Utilities
 * Collection of utility functions for input validation
 */

/**
 * Validate that input is a number
 * @param {*} value - Value to validate
 * @returns {boolean} - True if valid number
 */
export function isValidNumber(value) {
  if (value === null || value === undefined || value === "") return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate that a string is not empty
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty
 */
export function isNotEmpty(value) {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Validate an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a date string in YYYY-MM-DD format
 * @param {string} dateString - Date string
 * @returns {boolean} - True if valid date
 */
export function isValidDate(dateString) {
  if (!dateString) return false;

  // Check format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  // Check if valid date
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate that a number is within a range
 * @param {number} value - Value to check
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - True if value is within range
 */
export function isWithinRange(value, min, max) {
  if (!isValidNumber(value)) return false;
  const num = parseFloat(value);
  return num >= min && num <= max;
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Convert string to number safely
 * @param {string} value - String value
 * @param {number} defaultValue - Default value if conversion fails
 * @returns {number} - Converted number or default value
 */
export function toNumber(value, defaultValue = 0) {
  if (!isValidNumber(value)) return defaultValue;
  return parseFloat(value);
}
