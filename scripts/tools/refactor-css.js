/**
 * CSS Variable Refactoring Script
 *
 * This script replaces hardcoded color values with CSS variables
 * across all CSS files in the project.
 *
 * NOTE: This is a one-time utility script and can be archived or moved to a /tools directory.
 * It is not part of the application's runtime functionality.
 */

const fs = require("fs");
const path = require("path");

// Define the project root
const projectRoot = path.resolve(__dirname, "..");

// Define the mapping of hardcoded values to CSS variables
const cssMap = {
  "#0059a6": "var(--royal-blue)",
  "#1f5e8d": "var(--light-ocean-blue)",
  "#123148": "var(--dark-ocean-blue)",
  "#acd4dd": "var(--sky-blue)",
  "#f2f7fa": "var(--ultra-light-blue)",
  "#231f20": "var(--black)",
  "#4f4f4f": "var(--dark-gray)",
  "#c2c2c2": "var(--light-gray)",
  "#ffffff": "var(--white)",
  "#f4f4f4": "var(--background-color)",
};

// Also update old variable names to new ones
const variableMap = {
  "var(--color-primary)": "var(--royal-blue)",
  "var(--color-primary-dark)": "var(--light-ocean-blue)",
  "var(--color-text)": "var(--black)",
  "var(--color-white)": "var(--white)",
  "var(--color-border)": "var(--light-gray)",
  "var(--Practically-Black, #231f20)": "var(--black)",
};

// Update the spacing variables from TimeEntry.css to match the global ones
const spacingMap = {
  "var(--spacing-xs)": "var(--spacing-xs)", // Already consistent
  "var(--spacing-sm)": "var(--spacing-md)", // 16px in TimeEntry.css vs 12px in global
  "var(--spacing-md)": "var(--spacing-lg)", // 24px in TimeEntry.css vs 16px in global
  "var(--spacing-lg)": "var(--spacing-xl)", // 32px in TimeEntry.css vs 24px in global
};

// Find all CSS files
function getCssFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory() && file !== "node_modules") {
      // Recursively search directories
      results = results.concat(getCssFiles(filePath));
    } else if (path.extname(file).toLowerCase() === ".css") {
      // Add CSS files to results
      results.push(filePath);
    }
  });

  return results;
}

// Process a CSS file
function processCssFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  // Skip the root CSS file where variables are defined
  if (filePath.endsWith("styles.css") && content.includes(":root")) {
    // Only update color values outside the :root declaration
    const rootStart = content.indexOf(":root");
    const rootEnd = content.indexOf("}", rootStart);

    if (rootStart !== -1 && rootEnd !== -1) {
      // Don't modify variable definitions, only their usage elsewhere
      const beforeRoot = content.substring(0, rootStart);
      const rootSection = content.substring(rootStart, rootEnd + 1);
      const afterRoot = content.substring(rootEnd + 1);

      // Only replace in sections outside the root declaration
      Object.keys(cssMap).forEach((key) => {
        const regex = new RegExp(
          key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "g"
        );
        beforeRoot = beforeRoot.replace(regex, cssMap[key]);
        afterRoot = afterRoot.replace(regex, cssMap[key]);
      });

      content = beforeRoot + rootSection + afterRoot;
    }
  } else {
    // For other files, replace all hardcoded values with CSS variables
    Object.keys(cssMap).forEach((key) => {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      content = content.replace(regex, cssMap[key]);
    });
  }

  // Replace old variable names with new ones
  Object.keys(variableMap).forEach((key) => {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    content = content.replace(regex, variableMap[key]);
  });

  // Update spacing variables in TimeEntry.css
  if (filePath.includes("TimeEntry.css")) {
    Object.keys(spacingMap).forEach((key) => {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      content = content.replace(regex, spacingMap[key]);
    });
  }

  // Write changes back to the file if there were changes
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
}

// Main function
function main() {
  const cssFiles = getCssFiles(projectRoot);
  console.log(`Found ${cssFiles.length} CSS files`);

  cssFiles.forEach(processCssFile);

  console.log("CSS variable refactoring complete!");
}

// Run the script
main();
