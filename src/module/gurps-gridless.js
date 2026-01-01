import { registerSettings, GURPSGridLess, modifyTokenConfig, addTokenConfigTab } from './settings.js';
import { drawEachReachIndicator } from './rangeindicator.js';
import { doborder } from './borders.js';
import { drawHitArea } from './hitArea.js';
import { setTokenDimensionsonUpdate, setTokenDimesionsOnCreate, setTokenDimensions } from './token.js';
import { updateSceneTokens } from './scene.js';
import { MODULE_ID } from './constants.js';
import { gurpsGridlessAPI } from './api.js';
import { createToggleRotationButton } from './toggleRotation.js';
import { clipRotationToFaces } from './rotation.js';
import { drawIndicator, updateIndicator, updateIndicatorDirection } from './indicator.js';

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
  doborder(token);
  updateIndicatorDirection(token);
});

Hooks.on('preUpdateToken', (d, c, o) => {
  clipRotationToFaces(d, c);
  setTokenDimensionsonUpdate(d, c, o);
  game.gurpsGridLess.showRangeIndicator = false;
  game.gurpsGridLess.showRangeIndicatorAll = false;
  drawEachReachIndicator();
});

Hooks.on('drawToken', (token) => {
  setTokenDimensions(token.document);
  drawHitArea(token);
  drawIndicator(token);
});

Hooks.on('updateToken', (tokenDokument, changes) => {
  drawHitArea(tokenDokument.object);
  doborder(tokenDokument.object);
  updateIndicator(tokenDokument, changes);
});

Hooks.on('updateScene', updateSceneTokens);

Hooks.on('preCreateToken', setTokenDimesionsOnCreate);

Hooks.on('preMoveToken', (d, c) => {
  if (game.gurpsGridLess.supressRotationOnMove) {
    c.autoRotate = false;
  }
});

Hooks.on('getSceneControlButtons', createToggleRotationButton);
