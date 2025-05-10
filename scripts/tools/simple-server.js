/**
 * Simple Live Server for TimeTracker
 *
 * This server serves files from the project root directory
 * to avoid CORS errors when using ES6 modules.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Define the project root directory (two levels up from this script)
const PROJECT_ROOT = path.join(__dirname, "../..");
console.log(`📂 Project root: ${PROJECT_ROOT}`);

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

// Create a server
const server = http.createServer((req, res) => {
  console.log(`📡 ${req.method} ${req.url}`);

  try {
    // Parse URL and create file path
    let url = req.url;

    // Strip query string parameters for cachebusting
    if (url.includes("?")) {
      url = url.substring(0, url.indexOf("?"));
    }

    // Default to index.html for root path
    if (url === "/" || url === "") {
      url = "/index.html";
    }
    // Create absolute path to file
    const filePath = path.join(PROJECT_ROOT, url);
    console.log(`🔍 Looking for: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);

      // For CSS files, try to find them in project root as fallback
      if (url.endsWith(".css")) {
        const cssName = path.basename(url);
        const fallbackPath = path.join(PROJECT_ROOT, cssName);

        console.log(`🔄 Trying fallback path for CSS: ${fallbackPath}`);

        if (fs.existsSync(fallbackPath)) {
          console.log(`✅ Found CSS at fallback path: ${fallbackPath}`);
          const cssContent = fs.readFileSync(fallbackPath);
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(cssContent);
          return;
        }
      }

      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <head><title>404 Not Found</title></head>
          <body>
            <h1>404 Not Found</h1>
            <p>The file you requested was not found: ${req.url}</p>
            <p>Server looked for: ${filePath}</p>
            <p><a href="/">Go to homepage</a></p>
          </body>
        </html>
      `);
      return;
    }

    // Get file extension and content type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error(`❌ Error reading file: ${err}`);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h1>500 Server Error</h1><p>${err.message}</p>`);
        return;
      }

      console.log(`✅ Serving: ${filePath} (${contentType})`);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  } catch (err) {
    console.error(`❌ Server error: ${err.message}`);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<h1>500 Server Error</h1><p>${err.message}</p>`);
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`
========================================================
🚀 LIVE SERVER STARTED
========================================================

Server is running at: http://localhost:${PORT}/
Serving files from: ${PROJECT_ROOT}

✨ Open your browser to http://localhost:${PORT}/ to view the app

Press Ctrl+C to stop the server
========================================================
`);
});
