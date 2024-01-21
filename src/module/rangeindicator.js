import { defaultColors, faceAngels } from './constants.js';
import { bodyShape, facingShape } from './shapes.js';
import { MODULE_ID } from './constants.js';

export function drawReachIndicator(token) {
  try {
    
    const { w: width, h: height } = token;

    // Create or update the range indicator
    if (!token.reachIndicator || token.reachIndicator._destroyed) {
      const container = new PIXI.Container({ name: 'reachIndicator', width, height }); //eslint-disable-line no-undef
      container.name = 'reachIndicator';

      const g = new PIXI.Graphics(); //eslint-disable-line no-undef

      //add the graphics to the container
      container.addChild(g);
      container.graphics = g;
      token.reachIndicator = container;
      //add the container to the token
      token.addChild(container);
    } 

    //get the rotation of the token
    const tokenDirection = token.document.flags['about-face']?.direction ?? 90;

    const maxReach = game.settings.get(MODULE_ID, 'maxReachShown');
    
    token.reachIndicator.width = width;
    token.reachIndicator.height = height;
    token.reachIndicator.x = width / 2;
    token.reachIndicator.y = height / 2;

    const graphics = token.reachIndicator.graphics;
    graphics.clear();

    const { lineAplha, fillAplha, lineColor, frontColor, sideColor, backColor } = defaultColors;

    const gridSize = canvas.grid.size;

    for (let r = 1; r <= maxReach; r++) {
      bodyShape(graphics, width + r * gridSize, height + r * gridSize, 2, lineColor, lineColor, lineColor, lineAplha)
    }

    facingShape(graphics, width + (maxReach + 0.5) * gridSize, height + (maxReach + 0.5) * gridSize, frontColor, sideColor, backColor, fillAplha);

  
    //update the rotation of the indicator
    token.reachIndicator.angle = tokenDirection - 90;
    
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
