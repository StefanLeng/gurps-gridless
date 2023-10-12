import { defaultColors, faceAngels } from './constants.js';

export function drawReachIndicator(token) {
  try {
    //get the rotation of the token
    const tokenDirection = token.document.flags['about-face']?.direction ?? 90;

    // Create or update the range indicator
    if (!token.reachIndicator || token.reachIndicator._destroyed) {
      const { w: width, h: height } = token;
      const container = new PIXI.Container({ name: 'reachIndicator', width, height });
      container.name = 'reachIndicator';
      container.width = width;
      container.height = height;
      container.x = width / 2;
      container.y = height / 2;

      const { lineAplha, fillAplha, lineColor, frontColor, sideColor, backColor } = defaultColors;

      const gridSize = canvas.grid.size;
      const rangeCRadius = gridSize / 2;
      const range1Radius = gridSize / 2 + gridSize;
      const range2Radius = gridSize / 2 + 2 * gridSize;
      const graphics = new PIXI.Graphics();

      graphics
        .lineStyle(2, lineColor, lineAplha)
        .drawCircle(0, 0, rangeCRadius)
        .drawCircle(0, 0, range1Radius)
        .drawCircle(0, 0, range2Radius)
        .lineStyle(0, lineColor, 0)
        .beginFill(frontColor, fillAplha)
        .arc(0, 0, range2Radius * 1.2, faceAngels.start, faceAngels.front)
        .endFill()
        .beginFill(sideColor, fillAplha)
        .arc(0, 0, range2Radius * 1.2, faceAngels.front, faceAngels.right)
        .lineTo(0, 0)
        .endFill()
        .beginFill(backColor, fillAplha)
        .arc(0, 0, range2Radius * 1.2, faceAngels.right, faceAngels.back)
        .lineTo(0, 0)
        .endFill()
        .beginFill(sideColor, fillAplha)
        .arc(0, 0, range2Radius * 1.2, faceAngels.back, faceAngels.left)
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
