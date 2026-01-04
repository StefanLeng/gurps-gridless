import { setTokenDimensions, setTokenDimensionsOnEnable, resetTokenDimensionsOnDisable } from './token.js';

export function updateSceneTokens(sceneDocument, changed) {
  if (changed.grid) {
    sceneDocument.tokens.forEach((t) => setTokenDimensions(t));
  }
}

export function enableGURPSMovementForScene(sceneDocument) {
  sceneDocument.tokens.forEach((t) => setTokenDimensionsOnEnable(t));
}

export function disableGURPSMovementForScene(sceneDocument) {
  sceneDocument.tokens.forEach((t) => resetTokenDimensionsOnDisable(t));
}

export function enableGURPSMovementForAllScenes() {
  game.scenes.forEach((t) => enableGURPSMovementForScene(t));
}

export function disableGURPSMovementForAllScenes() {
  game.scenes.forEach((t) => disableGURPSMovementForScene(t));
}
