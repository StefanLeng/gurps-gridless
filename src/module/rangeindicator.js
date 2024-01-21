import { defaultColors, faceAngels } from './constants.js';
import { bodyShape, facingShape } from './borders.js';
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

    const { w: width, h: height } = token;

    // Create or update the range indicator
    if (!token.reachIndicator || token.reachIndicator._destroyed) {
      lastMaxReach = maxReach;
      const container = new PIXI.Container({ name: 'reachIndicator', width, height }); //eslint-disable-line no-undef
      container.name = 'reachIndicator';

      const { lineAplha, fillAplha, lineColor, frontColor, sideColor, backColor } = defaultColors;

      const gridSize = canvas.grid.size;
      const rangeCRadius = gridSize / 2;
      const facingRadius = rangeCRadius + (maxReach + 0.5) * gridSize;
      const graphics = new PIXI.Graphics(); //eslint-disable-line no-undef

      graphics.lineStyle(2, lineColor, lineAplha).drawCircle(0, 0, rangeCRadius);

      for (let r = 1; r <= maxReach; r++) {
        //graphics.drawCircle(0, 0, rangeCRadius + r * gridSize);
        bodyShape(graphics, width + r * gridSize, height + r * gridSize, 2, lineColor, lineColor, lineColor, lineAplha)
      }

      facingShape(graphics, width + (maxReach + 0.5) * gridSize, height + (maxReach + 0.5) * gridSize, frontColor, sideColor, backColor, fillAplha);
      /*graphics
        .lineStyle(0, lineColor, 0)
        .beginFill(frontColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.frontStart, faceAngels.frontEnd)
        .endFill()
        .beginFill(sideColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.frontEnd, faceAngels.rightEnd)
        .lineTo(0, 0)
        .endFill()
        .beginFill(backColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.rightEnd, faceAngels.backEnd)
        .lineTo(0, 0)
        .endFill()
        .beginFill(sideColor, fillAplha)
        .arc(0, 0, facingRadius, faceAngels.backEnd, faceAngels.leftEnd)
        .lineTo(0, 0)
        .endFill();*/

      //add the graphics to the container
      container.addChild(graphics);
      container.graphics = graphics;
      token.reachIndicator = container;
      //add the container to the token
      token.addChild(container);
    } 
    
    token.reachIndicator.width = width;
    token.reachIndicator.height = height;
    token.reachIndicator.x = width / 2;
    token.reachIndicator.y = height / 2;
    //update the rotation of the indicator
    token.reachIndicator.angle = tokenDirection - 90;
    
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
