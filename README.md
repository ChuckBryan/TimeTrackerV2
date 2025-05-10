# TimeTracker

A modern, web-based time tracking application that helps professionals track their work hours, manage projects, and monitor PTO.

## Features

- Daily time entry and tracking
- Project management and filtering
- Previous timesheet viewing
- PTO tracking and management
- Responsive design for mobile and desktop

## Deployment

This project is configured for deployment to Azure Static Web Apps using the Azure Developer CLI (azd).

### Deployment Instructions

1. Install required tools:

   - Azure Developer CLI: [https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
   - Node.js and npm: [https://nodejs.org/](https://nodejs.org/)

2. Use the deployment script:

   ```
   .\deploy.ps1
   ```

   This handles all necessary steps - installing dependencies, logging in, and deploying to Azure.

For detailed deployment instructions, see `AZURE-DEPLOYMENT.md`.

## Development

### Option 1: Simple Server

For basic local development, you can use the simple server included in the tools directory:

```
node scripts/tools/simple-server.js
```

### Option 2: Azure Static Web Apps CLI (Recommended)

For a more production-like local development experience with Azure Static Web Apps features:

1. Install the Azure Static Web Apps CLI:

   ```
   npm install -g @azure/static-web-apps-cli
   ```

2. Start the local development server:
   ```
   swa start
   ```

This will serve the application and respect the routing rules defined in `staticwebapp.config.json`.

## Architecture

This project uses a modular JavaScript architecture:

- `app.js` - Main application entry point
- `/components/` - UI component modules
- `/utils/` - Shared utility functions

For more details, see `scripts/architecture.js` and `scripts/README.md`.
