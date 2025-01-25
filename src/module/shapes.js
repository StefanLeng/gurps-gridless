import { faceAngels } from './constants.js';
import { isHexRowGrid } from './token.js';

export function hex(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha) {
  const w = canvas.grid.sizeX / 2;
  const wHalf = w / 2;
  const h = canvas.grid.sizeY / 2;
  drawing
    .moveTo(w, 0)
    .lineStyle(lineWidth, frontColor, lineAplha)
    .lineTo(wHalf, h)
    .lineTo(-wHalf, h)
    .lineTo(-w, 0)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .lineTo(-wHalf, -h)
    .lineStyle(lineWidth, backColor, lineAplha)
    .lineTo(wHalf, -h)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .lineTo(w, 0);
}

function doHexLongBodyShape(width, height, f) {
  const w = (isHexRowGrid() ? canvas.grid.sizeY : canvas.grid.sizeX) / 2;
  const wHalf = w / 2;
  const h = (isHexRowGrid() ? canvas.grid.sizeX : canvas.grid.sizeY) / 2;
  let y = height;
  let posX = width % 2 === 1 ? wHalf : isHexRowGrid() ? w + wHalf : w + wHalf / Math.sqrt(3);
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
  let posX = x * w + (width % 2 === 1 ? wHalf : isHexRowGrid() ? -wHalf : -wHalf / Math.sqrt(3));
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
    .lineTo(radius, side);
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
    .endFill();
}

function wideBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha) {
  const radius = height / 2;
  const side = (width - height) / 2;
  drawing
    .moveTo(-side, radius)
    .lineStyle(lineWidth, frontColor, lineAplha)
    .arc(-side, 0, radius, faceAngels.forward, faceAngels.frontEnd)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .arc(-side, 0, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineStyle(lineWidth, backColor, lineAplha)
    .arc(-side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
    .lineTo(side, -radius)
    .arc(side, 0, radius, faceAngels.backward, faceAngels.backEnd)
    .lineStyle(lineWidth, sideColor, lineAplha)
    .arc(side, 0, radius, faceAngels.backEnd, faceAngels.leftEnd)
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
    .arc(-side, 0, radius, faceAngels.forward, faceAngels.frontEnd)
    .lineTo(side, 0)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.forward)
    .lineTo(-side, radius)
    .endFill()
    .moveTo(-side, 0)
    .beginFill(sideColor, fillAplha)
    .lineTo(-side - radius, 0)
    .arc(-side, 0, radius, faceAngels.frontEnd, faceAngels.rightEnd)
    .lineTo(-side, 0)
    .endFill()
    .moveTo(side, 0)
    .beginFill(sideColor, fillAplha)
    .lineTo(side + radius, 0)
    .arc(side, 0, radius, faceAngels.leftEnd, faceAngels.backEnd, true)
    .lineTo(side, 0)
    .endFill()
    .moveTo(-side, 0)
    .beginFill(backColor, fillAplha)
    .arc(-side, 0, radius, faceAngels.rightEnd, faceAngels.backward)
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

export function hexBodyShape(drawing, width, height, lineWidth, frontColor, sideColor, backColor, lineAplha) {
  let lastX = null;
  let lastY = null;

  let f = (x, y, face) => {
    const faceColor = face === 'FRONT' ? frontColor : face === 'SIDE' ? sideColor : backColor;
    drawing.lineStyle(lineWidth, faceColor, lineAplha);

    if (lastX === null || lastY === null) {
      drawing.moveTo(x, y);
    } else {
      drawing.lineTo(x, y);
    }
    lastX = x;
    lastY = y;
  };
  doHexBodyShape(width, height, f);
}

export function facingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha) {
  if (width > height) {
    wideFacingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha);
  } else {
    longFacingShape(drawing, width, height, frontColor, sideColor, backColor, fillAplha);
  }
}
