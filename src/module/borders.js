import { defaultColors, faceAngels } from './constants.js';

function longBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha) {
  const radius = width / 2;
  const side = (height - width) / 2;
  drawing
    .moveTo(radius, side)
    .lineStyle(lineWidth, frontColor, lineAplha)
    .arc(0, side, radius, faceAngels.frontStart, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .lineTo(-radius, -side)
    .arc(0, -side, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, lineAplha)
    .arc(0, -side, radius, faceAngels.rightEnd, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .arc(0, -side, radius, faceAngels.backEnd, faceAngels.leftEnd)
    .lineTo(radius, side)
}

function longFacingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha) {
  const radius = width / 2;
  const side = (height - width) / 2;
  drawing
    .lineStyle(0, 1, 0)
    .moveTo(radius, side)
    .beginFill(frontColor, fillAplha)
    .arc(0, side, radius, faceAngels.frontStart, faceAngels.frontEnd)
    .lineTo(radius, side)
    .endFill()    
    .moveTo(0, -side)  
    .beginFill(sideColor, fillAplha)
    .lineTo(0, side)
    .lineTo(-radius, side)
    .lineTo(-radius, -side)
    .arc(0, -side, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineTo(0, -side)
    .endFill()    
    .beginFill(sideColor, fillAplha)
    .lineTo(0, side)
    .lineTo(radius, side)
    .lineTo(radius, -side)
    .arc(0, -side, radius, faceAngels.leftEnd, faceAngels.backEnd, true)
    .lineTo(0, -side)
    .endFill()    
    .moveTo(0, -side)  
    .beginFill(backColor, fillAplha)
    .arc(0, -side, radius, faceAngels.rightEnd, faceAngels.backEnd)
    .lineTo(0, -side)
    .endFill()    
}

function wideBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha) {
  const radius = height / 2;
  const side = (width - height) / 2;
  drawing
    .moveTo(-side, radius)
    .lineStyle(lineWidth, frontColor, lineAplha)
    .arc( -side, 0, radius,  faceAngels.forward, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .arc( -side, 0, radius,  faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, lineAplha)
    .arc( -side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
    .lineTo(side, -radius)
    .arc(side, 0, radius, faceAngels.backward, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .arc(side, 0, radius, faceAngels.backEnd,faceAngels.leftEnd)
    .lineStyle(lineWidth, frontColor, lineAplha)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.forward)
    .lineTo(-side, radius);
}

function wideFacingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha) {
  const radius = height / 2;
  const side = (width - height) / 2;
  drawing
    .lineStyle(0, 1, 0)
    .moveTo(-side, radius)
    .beginFill(frontColor, fillAplha)
    .arc( -side, 0, radius,  faceAngels.forward, faceAngels.frontEnd)
    .lineTo(side, 0)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.forward)
    .lineTo(-side, radius)
    .endFill() 
    .moveTo(-side, 0)
    .beginFill(sideColor, fillAplha)
    .lineTo(-side - radius, 0)
    .arc( -side, 0, radius,  faceAngels.frontEnd, faceAngels.rightEnd)
    .lineTo(-side, 0)
    .endFill() 
    .moveTo(side, 0)
    .beginFill(sideColor, fillAplha)
    .lineTo(side + radius, 0)
    .arc( side, 0, radius, faceAngels.leftEnd, faceAngels.backEnd, true)
    .lineTo(side, 0)
    .endFill() 
    .moveTo(-side, 0)
    .beginFill(backColor, fillAplha)
    .arc( -side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
    .lineTo(side, -radius)
    .arc(side, 0, radius, faceAngels.backward, faceAngels.backEnd)
    .lineTo(side, 0)
    .lineTo(-side, 0)
    .endFill();
}

export function bodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha) {
  if (width > height) {
    wideBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha);
   } else {
    longBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha);
  }
}

export function facingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha) {
  if (width > height) {
    wideFacingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha);
   } else {
    longFacingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha);
  }
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
    bodyShape(token.border, width, height, innerWidth, borderColor, borderColor, borderColor, 1);
    bodyShape(token.border, width + 2 * innerWidth, height + 2 * innerWidth, outerWidth, frontColor, sideColor, backColor, 1);
  }

  token.border.angle = tokenDirection - 90;
}
