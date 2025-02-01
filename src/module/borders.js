import { bodyShape, hexBodyShape } from './shapes.js';
import { MODULE_ID } from './constants.js';
import { getcolorConfig, getDirection } from './rangeindicator.js';
import { isHexGrid } from './token.js';

export function doborder(token) {
  const { frontColor: frontColor, sideColor: sideColor, backColor: backColor } = getcolorConfig();

  const { w: width, h: height } = token;
  const { scaleY, scaleX } = token.document.texture;
  let anchorX, anchorY;
  if (token.document.gurpsGridless) {
    ({ anchorX, anchorY } = token.document.gurpsGridless);
  } else {
    ({ anchorX, anchorY } = token.document.texture);
  }
  token.border.x = width * 0.5;
  token.border.y = height * 0.5;
  token.border.clear();
  token.border.tint = 0xffffff;

  const borderColor = token._getBorderColor(); //null if there should be no border

  const innerWidth = game.settings.get(MODULE_ID, 'innerBorderWidth') ?? 6;
  const outerWidth = game.settings.get(MODULE_ID, 'outerBorderWidth') ?? 6;

  if (borderColor) {
    if (isHexGrid() && game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) {
      hexBodyShape(
        token.border,
        token.document.flags[MODULE_ID]?.tokenWidth,
        token.document.flags[MODULE_ID]?.tokenLength,
        outerWidth,
        innerWidth,
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
        0,
        borderColor,
        borderColor,
        borderColor,
        1,
      );
    } else {
      bodyShape(token.border, width, height, innerWidth, borderColor, borderColor, borderColor, 1);
      bodyShape(
        token.border,
        width + 2 * innerWidth,
        height + 2 * innerWidth,
        outerWidth,
        frontColor,
        sideColor,
        backColor,
        1,
      );
    }
  }

  token.border.pivot.y = height * (anchorY - 0.5) * scaleY;
  token.border.pivot.x = width * (anchorX - 0.5) * scaleX;
  token.border.angle = getDirection(token);
}
