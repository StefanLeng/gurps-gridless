import { registerSettings, GURPSGridLess, modifyTokenConfig, addTokenConfigTab } from './settings.js';
import { drawEachReachIndicator } from './rangeIndicator.js';
import { doBorder } from './borders.js';
import { drawHitArea } from './hitArea.js';
import { setTokenDimensionsOnUpdate, setTokenDimensionsOnCreate, setTokenDimensions } from './token.js';
import { updateSceneTokens } from './scene.js';
import { MODULE_ID } from './constants.js';
import { gurpsGridlessAPI } from './api.js';
import { createToggleRotationButton } from './toggleRotation.js';
import { clipRotationToFaces } from './rotation.js';
import { drawIndicator, updateIndicator, updateIndicatorDirection } from './indicator.js';
import { applyCloseRangeShift } from './closeCombatShift.js';

const version = '0.7.0';

// Initialize module
Hooks.once('init', async () => {
  console.log('gurps-gridless | Initializing gurps-gridless');

  game.gurpsGridLess = new GURPSGridLess();

  registerSettings();

  addTokenConfigTab(foundry.applications.sheets.TokenConfig);
  addTokenConfigTab(foundry.applications.sheets.PrototypeTokenConfig);

  game.modules.get(MODULE_ID).api = gurpsGridlessAPI;

  Hooks.callAll('gurpsGridlessReady', game.modules.get(MODULE_ID).api);
});

Hooks.once('ready', async () => {
  const oldVersion = game.settings.get(MODULE_ID, 'version') ?? '0.0.0';
  if (foundry.utils.isNewerVersion(version, oldVersion)) {
    foundry.applications.api.DialogV2.prompt({
      window: { title: 'New Version: Tools for Gridless GURPS' },
      content:
        '<p>Version 0.7.0 of Tools for Gridless GURPS</p><p>Hex Borders on hex grids with proper GURPS movement for multi hex tokens.</p><p>The new features need do be activated in the settings, because they will alter token behavior and setup in alle scenes.</p>',
      modal: true,
    });
    game.settings.set(MODULE_ID, 'version', version);
  }
});

Hooks.on('renderTokenConfig', (app, form, data) => modifyTokenConfig(app, form, data));
Hooks.on('renderPrototypeTokenConfig', (app, form, data) => modifyTokenConfig(app, form, data));

Hooks.on('refreshToken', (token) => {
  drawHitArea(token);
  doBorder(token);
  updateIndicatorDirection(token);
});

Hooks.on('preUpdateToken', (d, c, o) => {
  clipRotationToFaces(d, c);
  setTokenDimensionsOnUpdate(d, c, o);
  applyCloseRangeShift(d, c);
  game.gurpsGridLess.showRangeIndicator = false;
  game.gurpsGridLess.showRangeIndicatorAll = false;
  drawEachReachIndicator();
});

Hooks.on('drawToken', (token) => {
  setTokenDimensions(token.document);
  applyCloseRangeShift(token.document, {}, true);
  drawHitArea(token);
  drawIndicator(token);
});

Hooks.on('updateToken', (tokenDocument, changes) => {
  drawHitArea(tokenDocument.object);
  doBorder(tokenDocument.object);
  updateIndicator(tokenDocument, changes);
});

Hooks.on('updateScene', updateSceneTokens);

Hooks.on('preCreateToken', setTokenDimensionsOnCreate);

Hooks.on('preMoveToken', (d, c) => {
  if (game.gurpsGridLess.suppressRotationOnMove) {
    c.autoRotate = false;
  }
});

Hooks.on('getSceneControlButtons', createToggleRotationButton);
