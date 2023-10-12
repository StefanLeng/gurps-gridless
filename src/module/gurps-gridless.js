// Import JavaScript modules
import { registerSettings, GURPSGridLess } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { drawReachIndicator } from './modules/rangeindicator.js';
import { doborder } from './modules/borders.js';

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

// Add any additional hooks if necessary
Hooks.on('canvasReady', async () => {
  if (canvas.scene?.tokens) {
    canvas.scene.tokens.forEach((tokenDocument) => drawReachIndicator(tokenDocument.object));
  }
});

Hooks.on('createToken', (tokenDocument) => drawReachIndicator(tokenDocument.object));
Hooks.on('updateToken', (tokenDocument) => drawReachIndicator(tokenDocument.object));
Hooks.on('refreshToken' , (token) => doborder(token));
