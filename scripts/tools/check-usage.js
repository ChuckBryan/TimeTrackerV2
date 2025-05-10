/**
 * Check Usage Utility
 *
 * This script helps identify any remaining references to deprecated JS files
 * across the project to assist with the cleanup process.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "../..");
const DEPRECATED_FILES = [
  "scripts/main.js",
  "scripts/pto.js",
  "scripts/cache-bust.js",
];

// Directories to exclude from scan
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", "build"];

/**
 * Recursively scan all HTML files for script imports
 */
function scanForUsage(dir) {
  const results = {
    filesScanned: 0,
    referencesFound: [],
  };

  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      // Skip excluded directories
      if (stat.isDirectory()) {
        const relativePath = path.relative(ROOT_DIR, filePath);
        if (!EXCLUDE_DIRS.some((dir) => relativePath.startsWith(dir))) {
          scan(filePath);
        }
        continue;
      }

      // Check HTML files for script tags
      if (file.endsWith(".html")) {
        results.filesScanned++;
        const content = fs.readFileSync(filePath, "utf8");

        for (const deprecatedFile of DEPRECATED_FILES) {
          // Convert Windows path to URL format for comparison
          const urlPath = deprecatedFile.replace(/\\/g, "/");

          if (content.includes(urlPath)) {
            results.referencesFound.push({
              file: path.relative(ROOT_DIR, filePath),
              referencesDeprecated: deprecatedFile,
            });
          }
        }
      }
    }
  }

  scan(dir);
  return results;
}

/**
 * Run the scan and display results
 */
function main() {
  console.log(
    "Scanning project for references to deprecated JavaScript files..."
  );
  const results = scanForUsage(ROOT_DIR);

  console.log(`\nScanned ${results.filesScanned} HTML files`);

  if (results.referencesFound.length === 0) {
    console.log(
      "\n✅ No references to deprecated files found! Safe to remove them."
    );
  } else {
    console.log(
      `\n⚠️ Found ${results.referencesFound.length} references to deprecated files:`
    );

    const groupedByFile = {};
    results.referencesFound.forEach(({ file, referencesDeprecated }) => {
      if (!groupedByFile[file]) {
        groupedByFile[file] = [];
      }
      groupedByFile[file].push(referencesDeprecated);
    });

    for (const file in groupedByFile) {
      console.log(`\n${file}:`);
      groupedByFile[file].forEach((ref) => console.log(`  - ${ref}`));
    }

    console.log(
      "\nUpdate these files to use the new modular structure before removing deprecated files."
    );
  }
}

main();
