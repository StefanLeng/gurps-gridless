import { setTokenDimensions } from './token.js';

export function updateSceneTokens(sceneDocument, changed) {
  if (changed.grid) {
    sceneDocument.tokens.forEach((t) => setTokenDimensions(t));
  }
}
