import { defaultColors, faceAngels } from './constants.js';

function longBodyShape(border, width, height, lineWidth, frontColor, sideColor, backColor) {
  const radius = width / 2;
  const side = (height - width) / 2;
  border
    .lineStyle(lineWidth, frontColor, 1)
    .arc(0, side, radius, faceAngels.frontStart, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, 1)
    .lineTo(-radius, -side)
    .arc(0, -side, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, 1)
    .arc(0, -side, radius, faceAngels.rightEnd, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, 1)
    .arc(0, -side, radius, faceAngels.backEnd, faceAngels.leftEnd)
    .lineTo(radius, side)
}

function wideBodyShape(border, width, height, lineWidth, frontColor, sideColor, backColor)  {
  const radius = height / 2;
  const side = (width - height) / 2;
  border
    .lineStyle(lineWidth, frontColor, 1)
    .arc( -side, 0, radius,  faceAngels.forward, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, 1)
    .arc( -side, 0, radius,  faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, 1)
    .arc( -side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
    .lineTo(side, -radius)
    .arc(side, 0, radius, faceAngels.backward, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, 1)
    .arc(side, 0, radius, faceAngels.backEnd,faceAngels.leftEnd)
    .lineStyle(lineWidth, frontColor, 1)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.forward)
    .lineTo(-side, radius);
}

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
      if (width > height) {
        wideBodyShape(token.border, width, height, innerWidth, borderColor, borderColor, borderColor);
        wideBodyShape(token.border, width + 2 * innerWidth, height + 2 * innerWidth, outerWidth, frontColor, sideColor, backColor);
       } else {
        longBodyShape(token.border, width, height, innerWidth, borderColor, borderColor, borderColor);
        longBodyShape(token.border, width + 2 * innerWidth, height + 2 * innerWidth, outerWidth, frontColor, sideColor, backColor);
      }
  }

  token.border.angle = tokenDirection - 90;
}
