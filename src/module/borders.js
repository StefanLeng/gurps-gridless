import { defaultColors } from './constants.js';
import { bodyShape } from './shapes.js';

export function doborder(token) {
  const tokenDirection = token.document.flags['about-face']?.direction ?? 90;

  const { frontColor: frontColor, sideColor: sideColor, backColor: backColor } = defaultColors;

  const { w: width, h: height } = token;
  token.border.x = token.document.x + width / 2;
  token.border.y = token.document.y + height / 2;
  token.border.clear();

  const borderColor = token._getBorderColor(); //null if there should be no border

  const innerWidth = 3;
  const outerWidth = 2;
 
  if (borderColor) {
    bodyShape(token.border, width, height, innerWidth, borderColor, borderColor, borderColor, 1);
    bodyShape(token.border, width + 2 * innerWidth, height + 2 * innerWidth, outerWidth, frontColor, sideColor, backColor, 1);
  }

  token.border.angle = tokenDirection - 90;
}