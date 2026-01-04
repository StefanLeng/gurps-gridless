import { faceAngels } from './constants.js';
import { isHexRowGrid } from './token.js';

export function hex(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAlpha) {
  const w = canvas.grid.sizeX / 2;
  const wHalf = w / 2;
  const h = canvas.grid.sizeY / 2;
  drawing
    .moveTo(w, 0)
    .lineStyle(lineWidth, frontColor, lineAlpha)
    .lineTo(wHalf, h)
    .lineTo(-wHalf, h)
    .lineTo(-w, 0)
    .lineStyle(lineWidth, sideColor, lineAlpha)
    .lineTo(-wHalf, -h)
    .lineStyle(lineWidth, backColor, lineAlpha)
    .lineTo(wHalf, -h)
    .lineStyle(lineWidth, sideColor, lineAlpha)
    .lineTo(w, 0);
}

function doHexLongBodyShape(width, height, f) {
  const w = (isHexRowGrid() ? canvas.grid.sizeY : canvas.grid.sizeX) / 2;
  const wHalf = w / 2;
  const h = (isHexRowGrid() ? canvas.grid.sizeX : canvas.grid.sizeY) / 2;
  let y = height;
  let posX = wHalf;
  let down = false;
  let face = 'FRONT';
  f(posX, h * y, face);
  while (y > -height) {
    if (y > height - Math.ceil((width + 1) / 2)) {
      if (down) {
        y = y - 1;
        posX = posX - wHalf;
      } else {
        posX = posX - w;
      }
    } else if (y > -height + Math.ceil((width + 1) / 2)) {
      face = 'SIDE';
      y = y - 1;
      if (down) {
        posX = posX - wHalf;
      } else {
        posX = posX + wHalf;
      }
    } else {
      face = down || height > 1 ? 'BACK' : 'SIDE';
      if (!down) {
        y = y - 1;
        posX = posX + wHalf;
      } else {
        posX = posX + w;
      }
    }
    down = !down;
    f(posX, h * y, face);
  }
  while (y < height) {
    if (y < -height + Math.ceil(width / 2)) {
      face = down || height > 1 ? 'BACK' : 'SIDE';
      if (!down) {
        y = y + 1;
        posX = posX + wHalf;
      } else {
        posX = posX + w;
      }
    } else if (y < height - Math.ceil(width / 2)) {
      face = 'SIDE';
      y = y + 1;
      if (down) {
        posX = posX - wHalf;
      } else {
        posX = posX + wHalf;
      }
    } else {
      face = 'FRONT';
      if (down) {
        y = y + 1;
        posX = posX - wHalf;
      } else {
        posX = posX - w;
      }
    }
    down = !down;
    f(posX, h * y, face);
  }
}

function doHexWideBodyShape(width, height, f) {
  const w = (isHexRowGrid() ? canvas.grid.sizeY : canvas.grid.sizeX) / 2;
  const wHalf = w / 2;
  const h = (isHexRowGrid() ? canvas.grid.sizeX : canvas.grid.sizeY) / 2;
  let x = 0;
  let posX = wHalf;
  let dir = 0;
  let y = height;
  let face = 'FRONT';
  f(posX, h * y, face);
  while (x > -Math.ceil(width / 2)) {
    y = y + dir;
    x = x - (y >= height ? 0 : 1);
    if (dir === 0) {
      posX = posX - w;
      dir = y === height ? -1 : 1;
    } else {
      posX = posX - wHalf;
      dir = 0;
    }
    f(posX, h * y, face);
  }
  face = 'SIDE';
  let out = dir === 0 ? -1 : 1;
  while (y > -height + 1) {
    y = y - 1;
    out = -out;
    posX = posX + wHalf * out;
    f(posX, h * y, face);
  }
  face = 'BACK';
  dir = out === -1 ? -1 : 0;
  while (x < Math.floor(width / 2)) {
    y = y + dir;
    x = x + (y <= -height ? 0 : 1);
    if (dir === 0) {
      posX = posX + w;
      dir = y > -height ? -1 : 1;
    } else {
      posX = posX + wHalf;
      dir = 0;
    }
    f(posX, h * y, face);
  }
  face = 'SIDE';
  out = dir === 0 ? 1 : -1;
  while (y < height - 1) {
    y = y + 1;
    out = -out;
    posX = posX + wHalf * out;
    f(posX, h * y, face);
  }
  dir = out === -1 ? 0 : 1;
  face = 'FRONT';
  while (x >= 0) {
    y = y + dir;
    x = x - (y >= height ? 0 : 1);
    if (dir === 0) {
      posX = posX - w;
      dir = y < height ? 1 : -1;
    } else {
      posX = posX - wHalf;
      dir = 0;
    }
    f(posX, h * y, face);
  }
}

export function doHexBodyShape(width, height, f) {
  if (width > height) {
    doHexWideBodyShape(width, height, f);
  } else {
    doHexLongBodyShape(width, height, f);
  }
}

function longBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAlpha) {
  const radius = width / 2;
  const side = (height - width) / 2;
  drawing
    .moveTo(radius, side)
    .lineStyle(lineWidth, frontColor, lineAlpha)
    .arc(0, side, radius, faceAngels.frontStart, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, lineAlpha)
    .lineTo(-radius, -side)
    .arc(0, -side, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, lineAlpha)
    .arc(0, -side, radius, faceAngels.rightEnd, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, lineAlpha)
    .arc(0, -side, radius, faceAngels.backEnd, faceAngels.leftEnd)
    .lineTo(radius, side);
}

function longFacingShape(drawing, width, height, frontColor, sideColor, backColor, lineAlpha) {
  const radius = width / 2;
  const side = (height - width) / 2;
  drawing
    .lineStyle(0, 1, 0)
    .moveTo(radius, side)
    .beginFill(frontColor, lineAlpha)
    .arc(0, side, radius, faceAngels.frontStart, faceAngels.frontEnd)
    .lineTo(radius, side)
    .endFill()
    .moveTo(0, -side)
    .beginFill(sideColor, lineAlpha)
    .lineTo(0, side)
    .lineTo(-radius, side)
    .lineTo(-radius, -side)
    .arc(0, -side, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineTo(0, -side)
    .endFill()
    .beginFill(sideColor, lineAlpha)
    .lineTo(0, side)
    .lineTo(radius, side)
    .lineTo(radius, -side)
    .arc(0, -side, radius, faceAngels.leftEnd, faceAngels.backEnd, true)
    .lineTo(0, -side)
    .endFill()
    .moveTo(0, -side)
    .beginFill(backColor, lineAlpha)
    .arc(0, -side, radius, faceAngels.rightEnd, faceAngels.backEnd)
    .lineTo(0, -side)
    .endFill();
}

function wideBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAlpha) {
  const radius = height / 2;
  const side = (width - height) / 2;
  drawing
    .moveTo(-side, radius)
    .lineStyle(lineWidth, frontColor, lineAlpha)
    .arc(-side, 0, radius, faceAngels.forward, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, lineAlpha)
    .arc(-side, 0, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, lineAlpha)
    .arc(-side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
    .lineTo(side, -radius)
    .arc(side, 0, radius, faceAngels.backward, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, lineAlpha)
    .arc(side, 0, radius, faceAngels.backEnd, faceAngels.leftEnd)
    .lineStyle(lineWidth, frontColor, lineAlpha)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.forward)
    .lineTo(-side, radius);
}

function wideFacingShape(drawing, width, height, frontColor, sideColor, backColor, lineAlpha) {
  const radius = height / 2;
  const side = (width - height) / 2;
  drawing
    .lineStyle(0, 1, 0)
    .moveTo(-side, radius)
    .beginFill(frontColor, lineAlpha)
    .arc(-side, 0, radius, faceAngels.forward, faceAngels.frontEnd)
    .lineTo(side, 0)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.forward)
    .lineTo(-side, radius)
    .endFill()
    .moveTo(-side, 0)
    .beginFill(sideColor, lineAlpha)
    .lineTo(-side - radius, 0)
    .arc(-side, 0, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineTo(-side, 0)
    .endFill()
    .moveTo(side, 0)
    .beginFill(sideColor, lineAlpha)
    .lineTo(side + radius, 0)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.backEnd, true)
    .lineTo(side, 0)
    .endFill()
    .moveTo(-side, 0)
    .beginFill(backColor, lineAlpha)
    .arc(-side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
    .lineTo(side, -radius)
    .arc(side, 0, radius, faceAngels.backward, faceAngels.backEnd)
    .lineTo(side, 0)
    .lineTo(-side, 0)
    .endFill();
}

export function bodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAlpha) {
  if (width > height) {
    wideBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAlpha);
  } else {
    longBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAlpha);
  }
}

//Because line segment don't join nice when the color changes, draw the line segment as trapezoids.
//This only works correctly at convex angles. But the artifact at concave angels is hidden by the drawing order, so we don't care.
function drawHexSegment(drawing, startX, startY, endX, endY, width, offset) {
  let points = [];

  //half the amount a hex edge get longer when translated 1 outward
  const fact = 1 / Math.sqrt(3);

  //direction vector
  const dx = endX - startX;
  const dy = endY - startY;
  const l = Math.sqrt(dx * dx + dy * dy);
  //unit vector
  const udx = dx / l;
  const udy = dy / l;
  //udy, -udx is the perpendicular vector (note the x,y swap)
  // start point, translated offset outward and moved tho lengthen the line offset * fact
  const nx = startX + udy * offset - udx * offset * fact;
  const ny = startY - udx * offset - udy * offset * fact;

  points.push(nx, ny);

  //start point, translated (offset+width) outward and moved tho lengthen the line (offset+width) + fact
  const nx2 = startX + udy * (offset + width) - udx * (offset + width) * fact;
  const ny2 = startY - udx * (offset + width) - udy * (offset + width) * fact;

  points.push(nx2, ny2);

  //endpoint of outer line
  const nx3 = nx2 + dx + udx * (offset + width) * 2 * fact;
  const ny3 = ny2 + dy + udy * (offset + width) * 2 * fact;

  points.push(nx3, ny3);

  //endpoint of inner line
  const nx4 = nx + dx + udx * offset * 2 * fact;
  const ny4 = ny + dy + udy * offset * 2 * fact;

  points.push(nx4, ny4);

  drawing.drawPolygon(points);
}

export function hexBodyShape(
  drawing,
  width,
  height,
  lineWidth,
  lineOffset,
  frontColor,
  sideColor,
  backColor,
  lineAlpha,
) {
  let lastX = null;
  let lastY = null;

  let f = (x, y, face) => {
    const faceColor = face === 'FRONT' ? frontColor : face === 'SIDE' ? sideColor : backColor;
    drawing.lineStyle(lineWidth, faceColor, lineAlpha);

    if (lastX === null || lastY === null) {
      drawing.moveTo(x, y);
    } else {
      drawing.lineTo(x, y);
    }
    lastX = x;
    lastY = y;
  };

  let f2 = (x, y, face) => {
    const faceColor = face === 'FRONT' ? frontColor : face === 'SIDE' ? sideColor : backColor;
    drawing.lineStyle(1, faceColor, lineAlpha, 0);
    drawing.beginFill(faceColor, lineAlpha);

    if (lastX !== null && lastY !== null) {
      drawHexSegment(
        drawing,
        Math.round(lastX),
        Math.round(lastY),
        Math.round(x),
        Math.round(y),
        lineWidth,
        lineOffset,
      );
    }
    drawing.endFill();
    lastX = x;
    lastY = y;
  };

  doHexBodyShape(width, height, lineWidth > 1 ? f2 : f);
}

export function facingShape(drawing, width, height, frontColor, sideColor, backColor, lineAlpha) {
  if (width > height) {
    wideFacingShape(drawing, width, height, frontColor, sideColor, backColor, lineAlpha);
  } else {
    longFacingShape(drawing, width, height, frontColor, sideColor, backColor, lineAlpha);
  }
}
