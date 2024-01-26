// Import JavaScript modules
import { registerSettings, GURPSGridLess, injectTokenConfig } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { drawEachReachIndicator } from './rangeindicator.js';
import { doborder } from './borders.js';
import { fixTokenScale } from './tokenScale.js';
import { drawHitArea } from './hitArea.js';

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
//Hooks.once('setup', async () => {// Do anything after initialization but before
// ready
//});

// When ready
//Hooks.once('ready', async () => {
// Do anything once the module is ready
//});

Hooks.on('renderTokenConfig', injectTokenConfig);

Hooks.on('refreshToken', (token) => {
  fixTokenScale(token);
  doborder(token);
});

Hooks.on('preUpdateToken', () => {
  game.gurpsGridLess.showRangeIndicator = false;
  game.gurpsGridLess.showRangeIndicatorAll = false;
  drawEachReachIndicator();
});

Hooks.on('drawToken', drawHitArea);
Hooks.on('updateToken', (tokenDokument) => drawHitArea(tokenDokument.object));
