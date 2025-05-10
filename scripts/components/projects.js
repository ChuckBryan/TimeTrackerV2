/**
 * Projects Component
 * Handles project-specific functionality
 */

import { getElements, addEvent } from "../utils/dom-utils.js";

/**
 * Initialize project card expansion functionality
 */
export function initProjectCardExpansion() {
  const projectCards = getElements(".project-card");

  // Skip if no project cards found
  if (projectCards.length === 0) return;

  projectCards.forEach((card) => {
    const expandButton = card.querySelector(".expand-button");
    const cardDetails = card.querySelector(".project-card-details");

    if (expandButton && cardDetails) {
      addEvent(expandButton, "click", function (e) {
        e.preventDefault();

        // Toggle expanded state
        const isExpanded = cardDetails.classList.toggle("expanded");

        // Update button text and icon
        const buttonIcon = expandButton.querySelector("i");
        const buttonText = expandButton.querySelector("span");

        if (buttonIcon) {
          if (isExpanded) {
            buttonIcon.classList.remove("fa-chevron-down");
            buttonIcon.classList.add("fa-chevron-up");
          } else {
            buttonIcon.classList.remove("fa-chevron-up");
            buttonIcon.classList.add("fa-chevron-down");
          }
        }

        if (buttonText) {
          buttonText.textContent = isExpanded ? "Show Less" : "Show More";
        }

        // Update ARIA attributes
        expandButton.setAttribute("aria-expanded", isExpanded);
        cardDetails.setAttribute("aria-hidden", !isExpanded);
      });
    }
  });
}

/**
 * Initialize the project search functionality
 */
export function initProjectSearch() {
  const searchInput = document.getElementById("project-search");
  const projectItems = getElements(".project-item, .project-card");

  if (!searchInput || projectItems.length === 0) return;

  addEvent(searchInput, "input", function () {
    const searchTerm = searchInput.value.toLowerCase().trim();

    projectItems.forEach((item) => {
      const projectName =
        item.querySelector(".project-name")?.textContent.toLowerCase() || "";
      const clientName =
        item.querySelector(".client-name")?.textContent.toLowerCase() || "";
      const projectId =
        item.querySelector(".project-id")?.textContent.toLowerCase() || "";

      // Show/hide based on search match
      if (
        searchTerm === "" ||
        projectName.includes(searchTerm) ||
        clientName.includes(searchTerm) ||
        projectId.includes(searchTerm)
      ) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
}

/**
 * Initialize project filter functionality
 */
export function initProjectFilters() {
  const filterButtons = getElements(".filter-button");
  const projectItems = getElements(".project-item, .project-card");

  if (filterButtons.length === 0 || projectItems.length === 0) return;

  filterButtons.forEach((button) => {
    addEvent(button, "click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectItems.forEach((item) => {
        if (filterValue === "all") {
          item.style.display = "";
        } else {
          const status = item.getAttribute("data-status");
          item.style.display = status === filterValue ? "" : "none";
        }
      });
    });
  });
}
