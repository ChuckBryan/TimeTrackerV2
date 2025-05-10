/**
 * Previous Timesheet Component
 * Handles previous timesheet functionality
 */

import { getElement, getElements, addEvent } from "../utils/dom-utils.js";
import { formatDateMDY, parseDate } from "../utils/date-utils.js";

/**
 * Initialize Previous Timesheet functionality
 */
export function initPreviousTimesheet() {
  const weekLinks = getElements(".week-link");
  const filterSelect = getElement("timesheet-filter");

  // Set up click handlers for week links
  weekLinks.forEach((link) => {
    addEvent(link, "click", function (e) {
      e.preventDefault();
      const weekEndingDate = link.getAttribute("data-week-ending");
      if (weekEndingDate) {
        loadTimesheetDetails(weekEndingDate);
      }
    });
  });

  // Set up change handler for filter select
  if (filterSelect) {
    addEvent(filterSelect, "change", function () {
      filterTimesheets(filterSelect.value);
    });
  }

  // Initialize export functionality
  initExportFunctionality();
}

/**
 * Load timesheet details for a specific week
 * @param {string} weekEndingDate - Week ending date string
 */
function loadTimesheetDetails(weekEndingDate) {
  const contentArea = getElement("timesheet-details");
  if (!contentArea) return;

  // Show loading indicator
  contentArea.innerHTML = `<div class="loading-spinner">Loading timesheet data...</div>`;

  // In a real application, this would be an API call
  // For demo purposes, we'll simulate a delay and show mock data
  setTimeout(() => {
    const formattedDate = formatDateMDY(parseDate(weekEndingDate));

    contentArea.innerHTML = `
      <div class="timesheet-detail-header">
        <h2>Timesheet for Week Ending ${formattedDate}</h2>
        <div class="timesheet-actions">
          <button class="button button-secondary" id="print-timesheet">
            <i class="fas fa-print"></i> Print
          </button>
          <button class="button button-outline" id="export-timesheet">
            <i class="fas fa-file-export"></i> Export
          </button>
        </div>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Project Alpha</td>
            <td>8.0</td>
            <td>7.5</td>
            <td>8.0</td>
            <td>8.0</td>
            <td>6.0</td>
            <td>0.0</td>
            <td>0.0</td>
            <td>37.5</td>
          </tr>
          <tr>
            <td>Project Beta</td>
            <td>0.0</td>
            <td>0.5</td>
            <td>0.0</td>
            <td>0.0</td>
            <td>2.0</td>
            <td>0.0</td>
            <td>0.0</td>
            <td>2.5</td>
          </tr>
          <tr class="total-row">
            <td><strong>Daily Total</strong></td>
            <td><strong>8.0</strong></td>
            <td><strong>8.0</strong></td>
            <td><strong>8.0</strong></td>
            <td><strong>8.0</strong></td>
            <td><strong>8.0</strong></td>
            <td><strong>0.0</strong></td>
            <td><strong>0.0</strong></td>
            <td><strong>40.0</strong></td>
          </tr>
        </tbody>
      </table>
      
      <div class="timesheet-status">
        <div class="status-label">Status:</div>
        <div class="status-value approved">Approved</div>
      </div>
      
      <div class="timesheet-notes">
        <h3>Notes</h3>
        <p>This timesheet was approved by Jane Manager on ${formattedDate}.</p>
      </div>
    `;

    // Set up print button
    const printButton = getElement("print-timesheet");
    if (printButton) {
      addEvent(printButton, "click", function () {
        window.print();
      });
    }

    // Set up export button
    const exportButton = getElement("export-timesheet");
    if (exportButton) {
      addEvent(exportButton, "click", function () {
        exportTimesheet(weekEndingDate);
      });
    }
  }, 500);
}

/**
 * Filter timesheets based on selected criteria
 * @param {string} filterValue - Filter value
 */
function filterTimesheets(filterValue) {
  const timesheetRows = getElements(".previous-timesheet-row");

  if (filterValue === "all") {
    // Show all rows
    timesheetRows.forEach((row) => {
      row.style.display = "";
    });
  } else {
    // Filter rows based on status
    timesheetRows.forEach((row) => {
      const status = row.getAttribute("data-status");
      row.style.display = status === filterValue ? "" : "none";
    });
  }
}

/**
 * Initialize export functionality
 */
function initExportFunctionality() {
  const exportAllButton = getElement("export-all-timesheets");

  if (exportAllButton) {
    addEvent(exportAllButton, "click", function () {
      exportAllTimesheets();
    });
  }
}

/**
 * Export a specific timesheet
 * @param {string} weekEndingDate - Week ending date
 */
function exportTimesheet(weekEndingDate) {
  // In a real application, this would generate a file for download
  // For demo purposes, we'll just show an alert
  alert(
    `Exporting timesheet for week ending ${formatDateMDY(
      parseDate(weekEndingDate)
    )}`
  );
}

/**
 * Export all timesheets
 */
function exportAllTimesheets() {
  // In a real application, this would generate a file for download
  // For demo purposes, we'll just show an alert
  alert("Exporting all timesheets...");
}
