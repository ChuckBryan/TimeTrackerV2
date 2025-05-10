/**
 * Date Utilities
 * Collection of utility functions for date manipulation
 */

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export function formatDateYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format date to MM/DD/YYYY
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export function formatDateMDY(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Get the end of year date
 * @param {number} year - Year (defaults to current year)
 * @returns {Date} - End of year date
 */
export function getEndOfYear(year = new Date().getFullYear()) {
  return new Date(year, 11, 31);
}

/**
 * Calculate the number of days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} - Number of days
 */
export function getDaysBetweenDates(startDate, endDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const startDateUTC = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endDateUTC = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
}

/**
 * Get the week number for a date
 * @param {Date} date - Date object
 * @returns {number} - Week number (1-53)
 */
export function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

/**
 * Parse a date string in various formats
 * @param {string} dateString - Date string
 * @returns {Date} - Date object or null if invalid
 */
export function parseDate(dateString) {
  if (!dateString) return null;

  // Try different formats
  const date = new Date(dateString);
  if (!isNaN(date)) return date;

  // Try MM/DD/YYYY
  const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateString);
  if (mdy) {
    return new Date(parseInt(mdy[3]), parseInt(mdy[1]) - 1, parseInt(mdy[2]));
  }

  // Try YYYY-MM-DD
  const ymd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
  if (ymd) {
    return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
  }

  return null;
}

/**
 * Get an array of dates between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Date[]} - Array of dates
 */
export function getDatesBetween(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
