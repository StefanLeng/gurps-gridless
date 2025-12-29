import { bodyShape, hexBodyShape } from './shapes.js';
import { MODULE_ID } from './constants.js';
import { getcolorConfig } from './rangeindicator.js';
import { getDirection } from './rotation.js';
import { isHexGrid } from './token.js';

export function doborder(token) {
  const { frontColor: frontColor, sideColor: sideColor, backColor: backColor } = getcolorConfig();

  if (!token.GURPSGridlesOuterBorder) {
    token.GURPSGridlesOuterBorder = new PIXI.Graphics(); //eslint-disable-line no-undef
    token.addChild(token.GURPSGridlesOuterBorder);
  }

  const { w: width, h: height } = token;
  let anchorX, anchorY;
  if (token.document.gurpsGridless) {
    ({ anchorX, anchorY } = token.document.gurpsGridless);
  } else {
    ({ anchorX, anchorY } = token.document.texture);
  }
  token.border.x = width * 0.5;
  token.border.y = height * 0.5;
  token.border.clear();

  token.GURPSGridlesOuterBorder.x = width * 0.5;
  token.GURPSGridlesOuterBorder.y = height * 0.5;
  token.GURPSGridlesOuterBorder.clear();

  token.border.tint = 0xffffff;

  const borderColor = token._getBorderColor();
  const innerWidth = game.settings.get(MODULE_ID, 'innerBorderWidth') ?? 6;
  const outerWidth = game.settings.get(MODULE_ID, 'outerBorderWidth') ?? 6;

  if (isHexGrid() && game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) {
    hexBodyShape(
      token.GURPSGridlesOuterBorder,
      token.document.flags[MODULE_ID]?.tokenWidth,
      token.document.flags[MODULE_ID]?.tokenLength,
      outerWidth,
      0,
      frontColor,
      sideColor,
      backColor,
      1,
    );
    hexBodyShape(
      token.border,
      token.document.flags[MODULE_ID]?.tokenWidth,
      token.document.flags[MODULE_ID]?.tokenLength,
      innerWidth,
      -innerWidth,
      borderColor,
      borderColor,
      borderColor,
      1,
    );
  } else {
    bodyShape(token.border, width, height, innerWidth, borderColor, borderColor, borderColor, 1);
    bodyShape(
      token.GURPSGridlesOuterBorder,
      width + 2 * innerWidth,
      height + 2 * innerWidth,
      outerWidth,
      frontColor,
      sideColor,
      backColor,
      1,
    );
  }

  token.border.pivot.y = height * (anchorY - 0.5);
  token.border.pivot.x = width * (anchorX - 0.5);
  token.border.angle = getDirection(token);
  token.GURPSGridlesOuterBorder.pivot.y = height * (anchorY - 0.5);
  token.GURPSGridlesOuterBorder.pivot.x = width * (anchorX - 0.5);
  token.GURPSGridlesOuterBorder.angle = getDirection(token);
  token.GURPSGridlesOuterBorder.visible = game.settings.get(MODULE_ID, 'alwaysShowOuterBorder') || token.border.visible;
}

export function doEachBorder() {
  canvas.tokens.objects.children.forEach(doborder);
}
