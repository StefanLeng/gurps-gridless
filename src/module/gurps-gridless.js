// Import JavaScript modules
import { registerSettings, GURPSGridLess } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { drawReachIndicator } from './rangeindicator.js';
import { doborder } from './borders.js';

// Initialize module
Hooks.once('init', async () => {
  console.log('gurps-gridless | Initializing gurps-gridless');

  // Assign custom classes and constants here
  game.gurpsGridLess = new GURPSGridLess();

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
});

// Setup module
Hooks.once('setup', async () => {
  // Do anything after initialization but before
  // ready
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the module is ready
});

Hooks.on('refreshToken', (token) => doborder(token));
