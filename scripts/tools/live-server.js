/**
 * Live Server Helper
 *
 * This script helps users start a Live Server instance to serve
 * the TimeTracker application. This avoids CORS errors when
 * working with ES6 modules.
 */

// Instructions for using Live Server
console.log(`
========================================================
💡 HOW TO USE LIVE SERVER WITH COPILOT VISION
========================================================

To fix CORS errors when working with modules, follow these steps:

1. In VS Code, right-click on index.html
2. Select "Open with Live Server"
3. Your default browser will open with the application

- OR -

1. Click the "Go Live" button in VS Code's status bar (bottom)
2. Your default browser will open with the application

If you don't see "Open with Live Server" or "Go Live":
1. Make sure Live Server extension is installed
2. Try restarting VS Code

========================================================
`);

// For node.js users who want to start a simple HTTP server
const http = require("http");
const fs = require("fs");
const path = require("path");

// MIME types for different file extensions
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`📡 ${req.method} ${req.url}`);

  // Get the file path from the URL
  // Use absolute path to the project root directory
  const projectRoot = path.join(__dirname, "../..");
  let filePath = path.join(projectRoot, req.url);

  // Handle root URL
  if (req.url === "/" || req.url === "") {
    filePath = path.join(projectRoot, "index.html");
  }

  console.log(`🔍 Looking for file: ${filePath}`);

  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();

  // Set the content type based on the file extension
  const contentType = mimeTypes[extname] || "application/octet-stream";

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // File not found
        fs.readFile("./404.html", (error, content) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content, "utf-8");
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📂 Serving files from: ${path.resolve("./")}`);
    console.log(`📱 Press Ctrl+C to stop the server`);
  });
}

module.exports = server;
