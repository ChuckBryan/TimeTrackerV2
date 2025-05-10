/**
 * Time Entry Drawer Component
 * Handles the sliding drawer for time entry functionality
 */

import {
  getElement,
  getElements,
  addEvent,
  toggleClass,
} from "../utils/dom-utils.js";

/**
 * Initialize the time entry drawer functionality
 */
export function initTimeEntryDrawer() {
  console.log("🔧 Initializing time entry drawer");

  // Direct DOM access to avoid potential issues with helper functions
  const timeEntryTriggers = document.querySelectorAll(".time-entry-trigger");
  const timeEntryCells = document.querySelectorAll(".time-entry-cell");
  const closeBtn = document.getElementById("time-entry-close");
  const cancelBtn = document.getElementById("cancel-btn");
  const saveBtn = document.getElementById("save-btn");
  const timeEntryDrawer = document.getElementById("time-entry-drawer");

  // Check if critical elements exist
  console.log("Drawer element found:", timeEntryDrawer ? "Yes" : "No");
  console.log("Time entry cells found:", timeEntryCells.length);
  console.log("Triggers found:", timeEntryTriggers.length);

  // Create and check overlay
  const existingOverlay = document.getElementById("drawer-overlay");
  const overlay = existingOverlay || createNewOverlay();
  console.log("Using overlay:", overlay);

  if (!timeEntryDrawer) {
    console.error("❌ Time entry drawer not found in the DOM");
    return;
  }

  // Set up event listeners for cells with direct DOM methods
  timeEntryCells.forEach((cell) => {
    cell.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("📅 Time cell clicked");

      const day = this.getAttribute("data-day") || "wednesday";
      const date = this.getAttribute("data-date") || "07/20/22";

      // Direct drawer opening
      openDrawerDirect(timeEntryDrawer, overlay, day, date);

      // Get project info
      try {
        const row = this.closest("tr");
        if (row) {
          const projectLink = row.querySelector(".time-entry-trigger");
          if (projectLink) updateProjectInfo(projectLink);
        }
      } catch (err) {
        console.warn("Could not update project info:", err);
      }
    });
  });

  // Set up event listeners for project links
  timeEntryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("🔗 Project link clicked");

      // Open drawer with default day
      openDrawerDirect(timeEntryDrawer, overlay, "wednesday", "07/20/22");

      // Update project info directly
      updateProjectInfo(this);
    });
  });

  // Set up close buttons
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeDrawerDirect(timeEntryDrawer, overlay);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      closeDrawerDirect(timeEntryDrawer, overlay);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      closeDrawerDirect(timeEntryDrawer, overlay);
    });
  }

  // ESC key closes drawer
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && timeEntryDrawer.classList.contains("open")) {
      closeDrawerDirect(timeEntryDrawer, overlay);
    }
  });

  // Set up save button
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      handleSave(timeEntryDrawer, overlay);
    });
  }
}

/**
 * Create a new overlay element
 */
function createNewOverlay() {
  console.log("🔧 Creating new overlay");
  const overlay = document.createElement("div");
  overlay.id = "drawer-overlay";
  overlay.className = "drawer-overlay";

  // Set inline styles to ensure it works even without CSS
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.right = "0";
  overlay.style.bottom = "0";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999";
  overlay.style.display = "none";

  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Open drawer with direct DOM manipulation
 */
function openDrawerDirect(drawer, overlay, day, date) {
  console.log(`📂 Opening drawer for ${day}, ${date}`);

  if (!drawer || !overlay) {
    console.error("❌ Missing drawer or overlay elements");
    return;
  }

  // Show the overlay
  overlay.style.display = "block";
  overlay.classList.add("active");

  // Show the drawer
  drawer.classList.add("open");

  // Set inline styles to ensure it works without CSS
  drawer.style.right = "0";
  drawer.setAttribute("aria-hidden", "false");

  // Set active tab if possible
  const dayTabs = document.querySelectorAll(".day-tab");
  if (dayTabs.length > 0) {
    try {
      for (const tab of dayTabs) {
        const tabDay = tab.textContent.toLowerCase();
        if (tabDay.includes(day.substring(0, 3).toLowerCase())) {
          setActiveTabDirect(tab, dayTabs);
          break;
        }
      }
    } catch (err) {
      console.warn("Could not set active tab:", err);
    }
  }

  // Update date display
  try {
    const dateObj = new Date(date);
    const formattedDate =
      dateObj.toLocaleDateString("en-US", { weekday: "long" }) + ", " + date;
    const currentDateEl = document.getElementById("current-date");
    if (currentDateEl) {
      currentDateEl.textContent = formattedDate;
    }
  } catch (err) {
    console.warn("Could not update date display:", err);
  }

  // Prevent body scrolling
  document.body.style.overflow = "hidden";

  // Focus hours input
  setTimeout(() => {
    try {
      const hoursInput = document.getElementById("hours-input");
      if (hoursInput) {
        hoursInput.focus();
      }
    } catch (err) {
      console.warn("Could not focus hours input:", err);
    }
  }, 300);
}

/**
 * Close drawer with direct DOM manipulation
 */
function closeDrawerDirect(drawer, overlay) {
  console.log("📂 Closing drawer");

  if (!drawer || !overlay) {
    console.error("❌ Missing drawer or overlay elements");
    return;
  }

  // Hide the overlay
  overlay.style.display = "none";
  overlay.classList.remove("active");

  // Hide the drawer
  drawer.classList.remove("open");
  drawer.style.right = "-500px";
  drawer.setAttribute("aria-hidden", "true");

  // Re-enable body scrolling
  document.body.style.overflow = "";
}

/**
 * Set active tab directly
 */
function setActiveTabDirect(activeTab, allTabs) {
  // Remove active state from all tabs
  allTabs.forEach((tab) => {
    tab.classList.remove("active");
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("tabindex", "-1");
  });

  // Set active state on target tab
  activeTab.classList.add("active");
  activeTab.setAttribute("aria-selected", "true");
  activeTab.setAttribute("tabindex", "0");

  // Update date display
  const dayName = activeTab.textContent.trim();
  let dateStr = "";

  switch (dayName.toLowerCase()) {
    case "sun":
      dateStr = "Sunday, 07/17/22";
      break;
    case "mon":
      dateStr = "Monday, 07/18/22";
      break;
    case "tue":
      dateStr = "Tuesday, 07/19/22";
      break;
    case "wed":
      dateStr = "Wednesday, 07/20/22";
      break;
    case "thu":
      dateStr = "Thursday, 07/21/22";
      break;
    case "fri":
      dateStr = "Friday, 07/22/22";
      break;
    case "sat":
      dateStr = "Saturday, 07/23/22";
      break;
  }

  const currentDate = document.getElementById("current-date");
  if (currentDate) {
    currentDate.textContent = dateStr;
  }
}

/**
 * Update project information
 */
function updateProjectInfo(projectLink) {
  if (!projectLink) return;

  const projectTitle = document.getElementById("project-title");
  const clientName = document.getElementById("client-name");

  if (projectTitle) {
    projectTitle.textContent =
      projectLink.dataset.projectName || "Project Name";
  }

  if (clientName) {
    clientName.textContent = projectLink.dataset.clientName || "Client Name";
  }
}

/**
 * Handle save button click
 */
function handleSave(drawer, overlay) {
  try {
    const hours = document.getElementById("hours-input")?.value || "";
    const statusReport = document.getElementById("status-report")?.value || "";
    const activeDay =
      document.querySelector(".day-tab.active")?.textContent.trim() || "";

    console.log("💾 Saving time entry:", {
      day: activeDay,
      hours,
      statusReport,
    });

    // Close the drawer
    closeDrawerDirect(drawer, overlay);

    // Show success message
    const timesheetMessage = document.querySelector(".timesheet-message");
    if (timesheetMessage) {
      timesheetMessage.textContent = "Time entry saved successfully!";
      timesheetMessage.classList.add("success");

      setTimeout(() => {
        timesheetMessage.textContent = "";
        timesheetMessage.classList.remove("success");
      }, 3000);
    }
  } catch (err) {
    console.error("Save error:", err);
  }
}
