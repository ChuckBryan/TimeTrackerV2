/**
 * Centralized logging utility
 * Provides consistent logging across the application
 */

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Current log level (can be changed at runtime)
let currentLogLevel = LOG_LEVELS.INFO;

/**
 * Set the current log level
 * @param {number} level - Log level from LOG_LEVELS
 */
export function setLogLevel(level) {
  currentLogLevel = level;
}

/**
 * Log a debug message
 * @param {string} message - Main message
 * @param {any} [data] - Optional data to log
 */
export function debug(message, data) {
  if (currentLogLevel <= LOG_LEVELS.DEBUG) {
    console.debug(`🔍 ${message}`, data !== undefined ? data : "");
  }
}

/**
 * Log an info message
 * @param {string} message - Main message
 * @param {any} [data] - Optional data to log
 */
export function info(message, data) {
  if (currentLogLevel <= LOG_LEVELS.INFO) {
    console.info(`ℹ️ ${message}`, data !== undefined ? data : "");
  }
}

/**
 * Log a warning message
 * @param {string} message - Main message
 * @param {any} [data] - Optional data to log
 */
export function warn(message, data) {
  if (currentLogLevel <= LOG_LEVELS.WARN) {
    console.warn(`⚠️ ${message}`, data !== undefined ? data : "");
  }
}

/**
 * Log an error message
 * @param {string} message - Main message
 * @param {any} [data] - Optional data to log
 */
export function error(message, data) {
  if (currentLogLevel <= LOG_LEVELS.ERROR) {
    console.error(`❌ ${message}`, data !== undefined ? data : "");
  }
}

// Enable debug mode in development
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  currentLogLevel = LOG_LEVELS.DEBUG;
  debug("Debug logging enabled for local development");
}

// Export constants
export { LOG_LEVELS };
