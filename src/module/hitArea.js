import { MODULE_ID } from './constants.js';
import { getDirectionFromAbautFace } from './rangeindicator.js';

export function drawHitArea(token) {
  const { w: width, h: height } = token;
  const points = [
    new PIXI.Point(0, 0), //eslint-disable-line no-undef
    new PIXI.Point(width, 0), //eslint-disable-line no-undef
    new PIXI.Point(width, height), //eslint-disable-line no-undef
    new PIXI.Point(0, height), //eslint-disable-line no-undef
  ];

  const tokenDirectionDegree = getDirectionFromAbautFace(token);
  const tokenDirection = (tokenDirectionDegree / 180) * Math.PI;
  var mat = new PIXI.Matrix(); //eslint-disable-line no-undef
  mat.translate(
    -width / 2 - canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetX ?? 0),
    -height / 2 - canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetY ?? 0),
  );
  mat.rotate(tokenDirection);
  mat.translate(width / 2, height / 2);
  const rotatedPoints = points.map((p) => mat.apply(p));

  const hitArea = new PIXI.Polygon(rotatedPoints); //eslint-disable-line no-undef
  token.hitArea = hitArea;
}
