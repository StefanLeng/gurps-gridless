import { setTokenDimensions, setTokenDimesionsOnEnable, resetTokenDimensionsOnDisable } from './token.js';

export function updateSceneTokens(sceneDocument, changed) {
  if (changed.grid) {
    sceneDocument.tokens.forEach((t) => setTokenDimensions(t));
  }
}

export function enableGURPSMovmentforScene(sceneDocument) {
  sceneDocument.tokens.forEach((t) => setTokenDimesionsOnEnable(t));
}

export function disableURPSMovmentforScene(sceneDocument) {
  sceneDocument.tokens.forEach((t) => resetTokenDimensionsOnDisable(t));
}

export function enableGURPSMovmentforAllScenes() {
  game.scenes.forEach((t) => enableGURPSMovmentforScene(t));
}

export function disableGURPSMovmentforAllScenes() {
  game.scenes.forEach((t) => disableURPSMovmentforScene(t));
}
