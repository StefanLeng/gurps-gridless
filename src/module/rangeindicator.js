import { defaultColors, faceAngels } from './constants.js';
import { MODULE_ID } from './constants.js';

var lastMaxReach = 2;

export function drawReachIndicator(token) {
  try {
    //get the rotation of the token
    const tokenDirection = token.document.flags['about-face']?.direction ?? 90;

    const maxReach = game.settings.get(MODULE_ID, 'maxReachShown');

    if (maxReach != lastMaxReach && token.reachIndicator) {
      token.reachIndicator.destroy();
    }

    // Create or update the range indicator
    if (!token.reachIndicator || token.reachIndicator._destroyed) {
      lastMaxReach = maxReach;
      const { w: width, h: height } = token;
      const container = new PIXI.Container({ name: 'reachIndicator', width, height }); //eslint-disable-line no-undef
      container.name = 'reachIndicator';
      container.width = width;
      container.height = height;
      container.x = width / 2;
      container.y = height / 2;

      const { lineAplha, fillAplha, lineColor, frontColor, sideColor, backColor } = defaultColors;

      const gridSize = canvas.grid.size;
      const rangeCRadius = gridSize / 2;
      const facingRadius = rangeCRadius + (maxReach + 0.5) * gridSize;
      const graphics = new PIXI.Graphics(); //eslint-disable-line no-undef

      graphics.lineStyle(2, lineColor, lineAplha).drawCircle(0, 0, rangeCRadius);

      for (let r = 1; r <= maxReach; r++) {
        graphics.drawCircle(0, 0, rangeCRadius + r * gridSize);
      }

      graphics
        .lineStyle(0, lineColor, 0)
        .beginFill(frontColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.start, faceAngels.front)
        .endFill()
        .beginFill(sideColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.front, faceAngels.right)
        .lineTo(0, 0)
        .endFill()
        .beginFill(backColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.right, faceAngels.back)
        .lineTo(0, 0)
        .endFill()
        .beginFill(sideColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.back, faceAngels.left)
        .lineTo(0, 0)
        .endFill();

      //update the rotation of the indicator
      container.angle = tokenDirection - 90;
      //add the graphics to the container
      container.addChild(graphics);
      container.graphics = graphics;
      token.reachIndicator = container;
      //add the container to the token
      token.addChild(container);
    } else {
      const container = token.reachIndicator;
      //update the rotation of the indicator
      container.angle = tokenDirection - 90;
    }

    token.reachIndicator.graphics.visible =
      (game.gurpsGridLess.showRangeIndicator && token.controlled) || game.gurpsGridLess.showRangeIndicatorAll;
  } catch (error) {
    console.error(
      `GURPS gridless | Error drawing the reach indicator for token ${token.name} (ID: ${token.id}, Type: ${
        token.document?.actor?.type ?? null
      })`,
      error,
    );
  }
}

export function drawEachReachIndicator() {
  canvas.tokens.objects.children.forEach(drawReachIndicator);
}
