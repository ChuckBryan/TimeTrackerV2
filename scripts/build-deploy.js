// This script prepares the TimeTracker app for deployment
// It creates a 'dist' folder with only the necessary files

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Create dist folder if it doesn't exist
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  console.log("Cleaning existing dist folder...");
  fs.rmSync(distPath, { recursive: true, force: true });
}

console.log("Creating dist folder...");
fs.mkdirSync(distPath);

// Files and directories to include in the deployment
const filesToInclude = [
  "index.html",
  "previous-timesheet.html",
  "projects.html",
  "pto.html",
  "staticwebapp.config.json",
  "package.json",
  "components.css",
  "Content.css",
  "Nav.css",
  "PreviousTimesheet.css",
  "Projects.css",
  "PTO.css",
  "styles.css",
  "TimeEntry.css",
];

const dirsToInclude = ["scripts", "img"];

// Copy individual files
filesToInclude.forEach((file) => {
  const sourcePath = path.join(__dirname, "..", file);
  const destPath = path.join(distPath, file);
  if (fs.existsSync(sourcePath)) {
    console.log(`Copying ${file}...`);
    fs.copyFileSync(sourcePath, destPath);
  } else {
    console.warn(`Warning: ${file} not found, skipping.`);
  }
});

// Copy directories recursively
dirsToInclude.forEach((dir) => {
  const sourcePath = path.join(__dirname, "..", dir);
  const destPath = path.join(distPath, dir);

  if (fs.existsSync(sourcePath)) {
    console.log(`Copying ${dir}/ directory...`);
    // Create the directory first
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    // Copy the directory contents recursively
    copyDirRecursive(sourcePath, destPath);
  } else {
    console.warn(`Warning: ${dir}/ directory not found, skipping.`);
  }
});

// Copy directory recursively
function copyDirRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Essential scripts only - explicitly list what we need rather than exclude what we don't
  const essentialScriptFiles = [
    "app.js",
    "main.js",
    "pto.js",
    "architecture.js",
  ];

  // Essential subdirectories in scripts
  const essentialScriptDirs = ["components", "utils"];

  // If we're in the scripts directory, only copy essential files
  const isScriptsDir = src.endsWith("scripts");

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Files to always skip
    const skipFiles = [
      ".git",
      ".github",
      ".vscode",
      "node_modules",
      "test",
      "tests",
      "tools",
    ];

    if (skipFiles.includes(entry.name)) {
      continue;
    }

    // Skip test files and non-production files
    if (
      entry.isFile() &&
      (entry.name.endsWith(".test.js") ||
        entry.name.endsWith(".spec.js") ||
        entry.name === "README.md" ||
        entry.name.endsWith(".md") ||
        entry.name === "build-deploy.js" ||
        entry.name === "cache-bust.js" ||
        entry.name === "refactor-css.js")
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      // Skip node_modules directory
      if (entry.name === "node_modules") {
        continue;
      }

      // If in scripts directory, only include essential subdirectories
      if (isScriptsDir && !essentialScriptDirs.includes(entry.name)) {
        console.log(`Skipping non-essential directory: ${entry.name}`);
        continue;
      }

      fs.mkdirSync(destPath, { recursive: true });
      copyDirRecursive(srcPath, destPath);
    } else {
      // If in scripts directory, only include essential files
      if (isScriptsDir && !essentialScriptFiles.includes(entry.name)) {
        console.log(`Skipping non-essential script: ${entry.name}`);
        continue;
      }

      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("Build complete! Files prepared in the dist/ directory.");
