/**
 * Cache Busting Utility
 * Helps ensure users always get the latest version of JavaScript files
 */

export class CacheBuster {
  /**
   * Initialize the cache buster
   * @param {string} version - The version string or build timestamp
   */
  constructor(version) {
    this.version = version || this._generateTimestamp();
  }

  /**
   * Generate a timestamp for use as a version string
   * @returns {string} Timestamp in format YYYYMMDDHHMMSS
   */
  _generateTimestamp() {
    const now = new Date();
    return (
      now.getFullYear().toString() +
      this._padZero(now.getMonth() + 1) +
      this._padZero(now.getDate()) +
      this._padZero(now.getHours()) +
      this._padZero(now.getMinutes()) +
      this._padZero(now.getSeconds())
    );
  }

  /**
   * Pad a number with leading zero if less than 10
   * @param {number} num - The number to pad
   * @returns {string} Padded number as string
   */
  _padZero(num) {
    return num < 10 ? "0" + num : num.toString();
  }

  /**
   * Process all tags with data-cachebust attribute
   */
  processTags() {
    // Process all script tags with data-cachebust attribute
    document.querySelectorAll("script[data-cachebust]").forEach((script) => {
      if (script.src) {
        script.src = this._addVersionToUrl(script.src);
      }
    });

    // Process all link tags with data-cachebust attribute
    document.querySelectorAll("link[data-cachebust]").forEach((link) => {
      if (link.href) {
        link.href = this._addVersionToUrl(link.href);
      }
    });
  }

  /**
   * Add version query parameter to URL
   * @param {string} url - URL to add version to
   * @returns {string} URL with version parameter
   */
  _addVersionToUrl(url) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${this.version}`;
  }
}

/**
 * Initialize cache buster when script is loaded
 */
export function initCacheBuster() {
  const cacheBuster = new CacheBuster();

  // Run when DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      cacheBuster.processTags()
    );
  } else {
    cacheBuster.processTags();
  }

  return cacheBuster;
}
