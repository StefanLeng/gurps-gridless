import { registerSettings, GURPSGridLess, injectTokenConfig } from './settings.js';
import { drawEachReachIndicator } from './rangeindicator.js';
import { doborder } from './borders.js';
import { drawHitArea } from './hitArea.js';
import { setTokenDimensionsonUpdate, setTokenDimesnionsOnCreate } from './token.js';
import { updateSceneTokens } from './scene.js';

// Initialize module
Hooks.once('init', async () => {
  console.log('gurps-gridless | Initializing gurps-gridless');

  game.gurpsGridLess = new GURPSGridLess();

  registerSettings();
});

Hooks.on('renderTokenConfig', injectTokenConfig);

Hooks.on('refreshToken', (token) => {
  drawHitArea(token);
  doborder(token);
});

Hooks.on('preUpdateToken', (d, c) => {
  setTokenDimensionsonUpdate(d, c);
  game.gurpsGridLess.showRangeIndicator = false;
  game.gurpsGridLess.showRangeIndicatorAll = false;
  drawEachReachIndicator();
});

Hooks.on('drawToken', drawHitArea);

Hooks.on('updateToken', (tokenDokument) => {
  drawHitArea(tokenDokument.object);
  doborder(tokenDokument.object);
});

Hooks.on('updateScene', updateSceneTokens);

Hooks.on('preCreateToken', setTokenDimesnionsOnCreate);
