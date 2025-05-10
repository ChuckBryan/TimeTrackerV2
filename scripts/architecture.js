/**
 * @file Documentation for the modular architecture
 *
 * This file provides documentation on how the application's
 * modular architecture is structured and how to work with it.
 */

/**
 * Main Components:
 *
 * 1. app.js - Application entry point
 *    - Imports and initializes all components
 *    - Detects current page and loads appropriate functionality
 *    - Provides global event handling
 *
 * 2. Components - UI/feature modules
 *    - Each significant UI feature is encapsulated in its own module
 *    - Located in /scripts/components/
 *    - Examples: mobile-menu.js, time-entry-drawer.js
 *
 * 3. Utilities - Shared helper functions
 *    - Located in /scripts/utils/
 *    - Examples: dom-utils.js, date-utils.js, validation-utils.js
 *
 * 4. Tools - Build scripts and developer utilities
 *    - Located in /scripts/tools/
 *    - For development use only, not loaded by the application
 */

/**
 * When adding new functionality:
 *
 * 1. Identify which component it belongs to
 *    - If it's a major new feature, create a new component file
 *    - If it extends existing functionality, add to the relevant component
 *
 * 2. Add necessary exports from your component
 *    - Export initialization functions to be called from app.js
 *    - Keep component internals private when possible
 *
 * 3. Import the component in app.js
 *    - Add imports at the top of app.js
 *    - Initialize in the appropriate page section
 *
 * 4. Add CSS for the component
 *    - Add component-specific styles to components.css
 *    - Add global styles or variables to styles.css
 */

/**
 * Best Practices:
 *
 * 1. Use semantic DOM manipulation functions from dom-utils.js
 * 2. Follow consistent event binding patterns
 * 3. Keep components focused on a single responsibility
 * 4. Use parameter validation in public functions
 * 5. Add JSDoc comments to document public functions
 */
