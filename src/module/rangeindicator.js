import { bodyShape, facingShape } from './shapes.js';
import { MODULE_ID } from './constants.js';
import { defaultColors } from './constants.js';

export function getcolorConfig() {
  const config = Object.assign({}, defaultColors);
  config.lineAlpha = game.settings.get(MODULE_ID, 'reachLineAlpha') ?? defaultColors.lineAlpha;
  config.fillAlpha = game.settings.get(MODULE_ID, 'facingAlpha') ?? defaultColors.fillAlpha;
  return config;
}

export function getDirectionFromAbautFace(token) {
  return (
    (token.document.flags['about-face']?.direction ?? 90) +
    (token.document.flags['about-face']?.rotationOffset ?? 0) -
    90
  );
}

export function getDirection(token) {
  return token.document.lockRotation ? getDirectionFromAbautFace(token) : token.mesh.angle;
}

export function drawReachIndicator(token) {
  try {
    const { w: width, h: height } = token;
    const { anchorX, anchorY, scaleY, scaleX } = token.document.texture;

    // Create or update the range indicator
    if (!token.reachIndicator || token.reachIndicator._destroyed) {
      const container = new PIXI.Container({ name: 'reachIndicator', width, height }); //eslint-disable-line no-undef
      container.name = 'reachIndicator';

      const g = new PIXI.Graphics(); //eslint-disable-line no-undef

      //add the graphics to the containerS
      container.addChild(g);
      container.graphics = g;
      token.reachIndicator = container;
      //add the container to the token
      token.addChild(container);
    }

    const maxReach = token.document.flags[MODULE_ID]?.maxReachShown ?? game.settings.get(MODULE_ID, 'maxReachShown');

    token.reachIndicator.width = width;
    token.reachIndicator.height = height;
    token.reachIndicator.x = width * 0.5; //(1 - anchorX);
    token.reachIndicator.y = height * 0.5; //(1 - anchorY);

    const graphics = token.reachIndicator.graphics;
    graphics.clear();

    const { lineAlpha, fillAlpha, lineColor, frontColor, sideColor, backColor } = getcolorConfig();

    const gridSize = canvas.grid.size;

    for (let r = 1; r <= maxReach; r++) {
      bodyShape(
        graphics,
        width + r * 2 * gridSize,
        height + r * 2 * gridSize,
        2,
        lineColor,
        lineColor,
        lineColor,
        lineAlpha,
      );
    }

    facingShape(
      graphics,
      width + (maxReach * 2 + 1) * gridSize,
      height + (maxReach * 2 + 1) * gridSize,
      frontColor,
      sideColor,
      backColor,
      fillAlpha,
    );

    //update the rotation of the indicator
    token.reachIndicator.pivot.x = width * (anchorX - 0.5) * scaleX;
    token.reachIndicator.pivot.y = height * (anchorY - 0.5) * scaleY;
    token.reachIndicator.angle = getDirection(token);

    token.reachIndicator.graphics.visible =
      (game.gurpsGridLess.showRangeIndicator && token.controlled) || game.gurpsGridLess.showRangeIndicatorAll;
  } catch (error) {
    console.error(
      `GURPS gridless | Error drawing the reach indicator for token ${token?.name} (ID: ${token?.id}, Type: ${
        token?.document?.actor?.type ?? null
      })`,
      error,
    );
  }
}

export function drawEachReachIndicator() {
  canvas.tokens.objects.children.forEach(drawReachIndicator);
}
