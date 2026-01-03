import { bodyShape, hexBodyShape } from './shapes.js';
import { MODULE_ID } from './constants.js';
import { getcolorConfig } from './rangeindicator.js';
import { getDirection, rotatePoint } from './rotation.js';
import { isHexGrid } from './token.js';

const PIXI = window.PIXI;

export function doborder(token) {
  const { frontColor: frontColor, sideColor: sideColor, backColor: backColor } = getcolorConfig();

  if (!token.GURPSGridlessOuterBorder) {
    token.GURPSGridlessOuterBorder = new PIXI.Graphics();
    token.addChild(token.GURPSGridlessOuterBorder);
  }

  const { w: width, h: height } = token;
  let anchorX, anchorY;
  if (token.document.gurpsGridless?.anchorX) {
    ({ anchorX, anchorY } = token.document.gurpsGridless);
  } else {
    ({ anchorX, anchorY } = token.document.texture);
  }
  token.border.x = width * 0.5;
  token.border.y = height * 0.5;
  token.border.clear();

  token.GURPSGridlessOuterBorder.x = width * 0.5;
  token.GURPSGridlessOuterBorder.y = height * 0.5;
  token.GURPSGridlessOuterBorder.clear();

  token.border.tint = 0xffffff;

  const borderColor = token._getBorderColor();
  const innerWidth = game.settings.get(MODULE_ID, 'innerBorderWidth') ?? 6;
  const outerWidth = game.settings.get(MODULE_ID, 'outerBorderWidth') ?? 6;

  if (isHexGrid() && game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) {
    hexBodyShape(
      token.GURPSGridlessOuterBorder,
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
      token.GURPSGridlessOuterBorder,
      width + 2 * innerWidth,
      height + 2 * innerWidth,
      outerWidth,
      frontColor,
      sideColor,
      backColor,
      1,
    );
  }

  //move the token image when shifted because of close range
  const tokenDirection = getDirection(token);
  const shift = token.document.gurpsGridless?.shift ?? { x: 0, y: 0 };
  const rShift = rotatePoint(shift, tokenDirection);
  token.mesh.y = token.y + token.h * 0.5 - rShift.y;
  token.mesh.x = token.x + token.w * 0.5 - rShift.x;

  if (!token.GURPSGridlessShiftIndicator) {
    token.GURPSGridlessShiftIndicator = new PIXI.Graphics();
    token.addChild(token.GURPSGridlessShiftIndicator);
  }
  token.GURPSGridlessShiftIndicator.clear();
  if (token.document.gurpsGridless?.shiftDist) {
    let dist = token.document.gurpsGridless.shiftDist;
    token.GURPSGridlessShiftIndicator.x = width * 0.5;
    token.GURPSGridlessShiftIndicator.y = height * 0.5;
    token.GURPSGridlessShiftIndicator.moveTo(0, 0)
      .lineStyle(1, 'black', 1)
      .moveTo(0, -4)
      .beginFill('lightGray')
      .lineTo(-1, -4)
      .lineTo(-1, -dist + 6)
      .lineTo(-6, -dist + 6)
      .lineTo(0, -dist)
      .lineTo(6, -dist + 6)
      .lineTo(1, -dist + 6)
      .lineTo(1, -4)
      .lineTo(-1, -4)
      .endFill();
    token.GURPSGridlessShiftIndicator.angle = tokenDirection + token.document.gurpsGridless.shiftAngle;
  }

  token.border.pivot.y = height * (anchorY - 0.5) + shift.y;
  token.border.pivot.x = width * (anchorX - 0.5) + shift.x;
  token.border.angle = tokenDirection;
  token.GURPSGridlessOuterBorder.pivot.y = height * (anchorY - 0.5) + shift.y;
  token.GURPSGridlessOuterBorder.pivot.x = width * (anchorX - 0.5) + shift.x;
  token.GURPSGridlessOuterBorder.angle = tokenDirection;
  token.GURPSGridlessOuterBorder.visible =
    game.settings.get(MODULE_ID, 'alwaysShowOuterBorder') || token.border.visible;
}

export function doEachBorder() {
  canvas.tokens.objects.children.forEach(doborder);
}
