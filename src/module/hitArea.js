//import { MODULE_ID } from './constants.js';
import { getDirectionFromAbautFace } from './rangeindicator.js';
import { isHexRowGrid, isHexGrid } from './token.js';
import { MODULE_ID } from './constants.js';

function rectangelHitArea(token) {
  const { w: width, h: height } = token;
  return [
    new PIXI.Point(0, 0), //eslint-disable-line no-undef
    new PIXI.Point(width, 0), //eslint-disable-line no-undef
    new PIXI.Point(width, height), //eslint-disable-line no-undef
    new PIXI.Point(0, height), //eslint-disable-line no-undef
  ];
}

function hexLongBodyShape(token) {
  const { w: widthpx, h: heightpx } = token;
  const w = (isHexRowGrid() ? canvas.grid.sizeY : canvas.grid.sizeX) / 2;
  const wHalf = w / 2;
  const h = (isHexRowGrid() ? canvas.grid.sizeX : canvas.grid.sizeY) / 2;
  const width = token.document.flags[MODULE_ID]?.tokenWidth;
  const height = token.document.flags[MODULE_ID]?.tokenLength;
  let y = height;
  let posX = width % 2 === 1 ? wHalf : isHexRowGrid() ? w + wHalf : w + wHalf / Math.sqrt(3);
  let down = false;
  let points = [new PIXI.Point(posX + widthpx / 2, h * y + heightpx / 2)]; //eslint-disable-line no-undef
  while (y > -height) {
    if (y > height - Math.ceil((width + 1) / 2)) {
      if (down) {
        y = y - 1;
        posX = posX - wHalf;
      } else {
        posX = posX - w;
      }
    } else if (y > -height + Math.ceil((width + 1) / 2)) {
      y = y - 1;
      if (down) {
        posX = posX - wHalf;
      } else {
        posX = posX + wHalf;
      }
    } else {
      if (!down) {
        y = y - 1;
        posX = posX + wHalf;
      } else {
        posX = posX + w;
      }
    }
    down = !down;
    points.push(new PIXI.Point(posX + widthpx / 2, h * y + heightpx / 2)); //eslint-disable-line no-undef
  }
  while (y < height) {
    if (y < -height + Math.ceil(width / 2)) {
      if (!down) {
        y = y + 1;
        posX = posX + wHalf;
      } else {
        posX = posX + w;
      }
    } else if (y < height - Math.ceil(width / 2)) {
      y = y + 1;
      if (down) {
        posX = posX - wHalf;
      } else {
        posX = posX + wHalf;
      }
    } else {
      if (down) {
        y = y + 1;
        posX = posX - wHalf;
      } else {
        posX = posX - w;
      }
    }
    down = !down;
    points.push(new PIXI.Point(posX + widthpx / 2, h * y + heightpx / 2)); //eslint-disable-line no-undef
  }

  return points;
}

export function drawHitArea(token) {
  const points = isHexGrid() ? hexLongBodyShape(token) : rectangelHitArea(token);

  const { w: width, h: height } = token;
  const { anchorX, anchorY, scaleY, scaleX } = token.document.texture;
  const tokenDirectionDegree = getDirectionFromAbautFace(token);
  const tokenDirection = (tokenDirectionDegree / 180) * Math.PI;

  var mat = new PIXI.Matrix(); //eslint-disable-line no-undef
  mat.translate(-width * (0.5 + (anchorX - 0.5) * scaleX), -height * (0.5 + (anchorY - 0.5) * scaleY));
  mat.rotate(tokenDirection);
  mat.translate(width * 0.5, height * 0.5);

  const rotatedPoints = points.map((p) => mat.apply(p));

  const hitArea = new PIXI.Polygon(rotatedPoints); //eslint-disable-line no-undef
  token.hitArea = hitArea;
}
