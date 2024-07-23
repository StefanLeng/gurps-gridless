import { bodyShape } from './shapes.js';
import { MODULE_ID } from './constants.js';
import { getcolorConfig, getDirection } from './rangeindicator.js';

export function doborder(token) {
  const { frontColor: frontColor, sideColor: sideColor, backColor: backColor } = getcolorConfig();

  const { w: width, h: height } = token;
  token.border.x = width / 2;
  token.border.y = height / 2;
  token.border.clear();

  const borderColor = token._getBorderColor(); //null if there should be no border

  const innerWidth = game.settings.get(MODULE_ID, 'innerBorderWidth') ?? 6;
  const outerWidth = game.settings.get(MODULE_ID, 'outerBorderWidth') ?? 6;

  if (borderColor) {
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

  token.border.pivot.y = canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetY ?? 0);
  token.border.pivot.x = canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetX ?? 0);
  token.border.angle = getDirection(token);
}
