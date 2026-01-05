import { bodyShape, facingShape } from './shapes.js';
import { MODULE_ID } from './constants.js';
import { getDirection } from './rotation.js';
import { getColorConfig } from './settings.js';

export function drawReachIndicator(token) {
  try {
    const { w: width, h: height } = token;
    const { scaleY, scaleX } = token.document.texture;
    let anchorX, anchorY;
    if (token.document.gurpsGridless) {
      ({ anchorX, anchorY } = token.document.gurpsGridless);
    } else {
      ({ anchorX, anchorY } = token.document.texture);
    }

    const widthG = (width * canvas.grid.sizeY) / canvas.grid.sizeX;

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

    const { lineAlpha, fillAlpha, lineColor, frontColor, sideColor, backColor } = getColorConfig();

    const gridSize = canvas.grid.size;

    for (let r = 1; r <= maxReach; r++) {
      bodyShape(
        graphics,
        widthG + r * 2 * gridSize,
        height + r * 2 * gridSize,
        2,
        lineColor,
        lineColor,
        lineColor,
        lineAlpha,
      );
    }

    const overdraw = game.settings.get(MODULE_ID, 'reachIndicatorOverdraw') ?? 0.5;
    facingShape(
      graphics,
      widthG + (maxReach * 2 + overdraw * 2) * gridSize,
      height + (maxReach * 2 + overdraw * 2) * gridSize,
      frontColor,
      sideColor,
      backColor,
      fillAlpha,
    );

    //update the rotation of the indicator
    token.reachIndicator.pivot.x = widthG * (anchorX - 0.5) * scaleX;
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
