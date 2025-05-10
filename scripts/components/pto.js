/**
 * PTO Component
 * Handles paid time off functionality
 */

import { getElement, addEvent } from "../utils/dom-utils.js";
import {
  formatDateMDY,
  parseDate,
  getDaysBetweenDates,
} from "../utils/date-utils.js";
import { isValidNumber, toNumber } from "../utils/validation-utils.js";

/**
 * Initialize PTO page functionality
 */
export function initPTO() {
  // Initialize the PTO Balance Calculator
  initPTOCalculator();

  // Initialize the PTO Cash Out functionality
  initPTOCashOut();

  // Initialize PTO Request Form
  initPTORequestForm();
}

/**
 * Initialize PTO Calculator functionality
 */
function initPTOCalculator() {
  const calculateButton = getElement("btn-calculate");
  const targetDateInput = getElement("target-date");
  const ptoToSpendInput = getElement("pto-to-spend");
  const ptoToConvertInput = getElement("pto-to-convert");

  if (!calculateButton || !targetDateInput) return;

  // Set default date to end of year
  const currentYear = new Date().getFullYear();
  const endOfYear = `${currentYear}-12-31`;
  targetDateInput.value = endOfYear;

  // Calculate button click handler
  addEvent(calculateButton, "click", function () {
    calculatePTOBalance();
  });
}

/**
 * Calculate PTO Balance based on inputs
 */
function calculatePTOBalance() {
  const targetDateEl = getElement("target-date");
  const ptoToSpendEl = getElement("pto-to-spend");
  const ptoToConvertEl = getElement("pto-to-convert");
  const resultElement = getElement("pto-calculation-result");

  if (!targetDateEl || !ptoToSpendEl || !ptoToConvertEl || !resultElement)
    return;

  const targetDate = targetDateEl.value;
  const ptoToSpend = toNumber(ptoToSpendEl.value, 0);
  const ptoToConvert = toNumber(ptoToConvertEl.value, 0);

  // Get current PTO balance from the displayed values
  const currentBalance = {
    vacation: parseFloat(
      document.querySelector(".vacation-balance")?.textContent || "0"
    ),
    personal: parseFloat(
      document.querySelector(".personal-balance")?.textContent || "0"
    ),
    floating: parseFloat(
      document.querySelector(".floating-balance")?.textContent || "0"
    ),
  };

  // Calculate days until target date
  const today = new Date();
  const targetDay = parseDate(targetDate);
  const daysRemaining = getDaysBetweenDates(today, targetDay);

  // Accrual rates (example values, would be pulled from API in real system)
  const accrualRate = {
    vacation: 1.54, // Bi-weekly accrual rate
    personal: 0.31, // Bi-weekly accrual rate
    floating: 0, // No accrual for floating holidays
  };

  // Calculate accruals until target date
  const payPeriods = Math.floor(daysRemaining / 14); // Bi-weekly pay periods
  const accruals = {
    vacation: payPeriods * accrualRate.vacation,
    personal: payPeriods * accrualRate.personal,
    floating: 0, // No accrual for floating holidays
  };

  // Calculate projected balances
  const projected = {
    vacation:
      currentBalance.vacation + accruals.vacation - ptoToSpend - ptoToConvert,
    personal: currentBalance.personal + accruals.personal,
    floating: currentBalance.floating,
    total: 0, // Will calculate below
  };

  projected.total =
    projected.vacation + projected.personal + projected.floating;

  // Display results
  resultElement.innerHTML = `
    <h3>Projected PTO Balance</h3>
    <div class="pto-calculation-details">
      <p>As of ${formatDateMDY(targetDay)}, your projected balance will be:</p>
      <div class="pto-result-grid">
        <div class="result-label">Vacation:</div>
        <div class="result-value">${projected.vacation.toFixed(2)} hours</div>
        
        <div class="result-label">Personal:</div>
        <div class="result-value">${projected.personal.toFixed(2)} hours</div>
        
        <div class="result-label">Floating Holiday:</div>
        <div class="result-value">${projected.floating.toFixed(2)} hours</div>
        
        <div class="result-label">Total:</div>
        <div class="result-value">${projected.total.toFixed(2)} hours</div>
      </div>
    </div>
  `;

  resultElement.classList.remove("hidden");
}

/**
 * Initialize PTO Cash Out functionality
 */
function initPTOCashOut() {
  const cashOutForm = getElement("pto-cashout-form");
  const cashOutButton = getElement("btn-cashout");
  const hoursInput = getElement("cashout-hours");

  if (!cashOutForm || !cashOutButton || !hoursInput) return;

  addEvent(cashOutForm, "submit", function (e) {
    e.preventDefault();
    processCashOut();
  });
}

/**
 * Process PTO Cash Out request
 */
function processCashOut() {
  const hoursInput = getElement("cashout-hours");
  const resultElement = getElement("cashout-result");

  if (!hoursInput || !resultElement) return;

  const hours = toNumber(hoursInput.value);

  if (!isValidNumber(hours) || hours <= 0) {
    resultElement.innerHTML = `<div class="error-message">Please enter a valid number of hours.</div>`;
    resultElement.classList.remove("hidden");
    return;
  }

  // Get current vacation balance
  const currentVacation = parseFloat(
    document.querySelector(".vacation-balance")?.textContent || "0"
  );

  // Check if enough hours available
  if (hours > currentVacation) {
    resultElement.innerHTML = `<div class="error-message">You don't have enough vacation hours available.</div>`;
    resultElement.classList.remove("hidden");
    return;
  }

  // Calculate cash out amount (example: $25 per hour)
  const hourlyRate = 25;
  const cashOutAmount = hours * hourlyRate;

  // Display success message
  resultElement.innerHTML = `
    <div class="success-message">
      <p>Your cash out request for ${hours} hours has been submitted.</p>
      <p>Estimated amount: $${cashOutAmount.toFixed(2)}</p>
      <p>You will receive a confirmation email shortly.</p>
    </div>
  `;
  resultElement.classList.remove("hidden");
}

/**
 * Initialize PTO Request Form
 */
function initPTORequestForm() {
  const requestForm = getElement("pto-request-form");
  const submitButton = getElement("btn-submit-pto");

  if (!requestForm || !submitButton) return;

  addEvent(requestForm, "submit", function (e) {
    e.preventDefault();
    submitPTORequest();
  });
}

/**
 * Submit PTO Request
 */
function submitPTORequest() {
  const startDateInput = getElement("pto-start-date");
  const endDateInput = getElement("pto-end-date");
  const typeSelect = getElement("pto-type");
  const commentInput = getElement("pto-comment");
  const resultElement = getElement("pto-request-result");

  if (!startDateInput || !endDateInput || !typeSelect || !resultElement) return;

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const ptoType = typeSelect.value;
  const comment = commentInput ? commentInput.value : "";

  // Validate inputs
  if (!startDate || !endDate) {
    resultElement.innerHTML = `<div class="error-message">Please select both start and end dates.</div>`;
    resultElement.classList.remove("hidden");
    return;
  }

  // Validate date range
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (start > end) {
    resultElement.innerHTML = `<div class="error-message">End date must be after start date.</div>`;
    resultElement.classList.remove("hidden");
    return;
  }

  // Calculate hours based on days
  const days = getDaysBetweenDates(start, end) + 1; // Include both start and end days
  const hours = days * 8; // Assuming 8 hours per day

  // In a real app, you would send this to a server
  // For now, we'll just display a success message
  resultElement.innerHTML = `
    <div class="success-message">
      <h3>PTO Request Submitted</h3>
      <p>Your request has been submitted for approval.</p>
      <p>Details:</p>
      <ul>
        <li>Start Date: ${formatDateMDY(start)}</li>
        <li>End Date: ${formatDateMDY(end)}</li>
        <li>Type: ${ptoType}</li>
        <li>Total Days: ${days}</li>
        <li>Total Hours: ${hours}</li>
      </ul>
      <p>You will receive an email when your request has been processed.</p>
    </div>
  `;
  resultElement.classList.remove("hidden");
}
