import { MODULE_ID } from './constants.js';

export function drawHitArea(token) {
  const { w: width, h: height } = token;
  const points = [new PIXI.Point(0, 0), new PIXI.Point(width, 0,), new PIXI.Point(width, height), new PIXI.Point(0, height)];

  const tokenDirectionDegree = ((token.document.flags['about-face']?.direction ?? 90) - 90);
  const tokenDirection = tokenDirectionDegree / 180 * Math.PI;
  var mat = new PIXI.Matrix();
  mat.translate(-width / 2 - canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetX ?? 0), -height / 2 - canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetY ?? 0));
  mat.rotate(tokenDirection);
  mat.translate(width / 2, height/ 2);
  const rotatedPoints = points.map(p => mat.apply(p));

  const hitArea = new PIXI.Polygon(rotatedPoints);
  token.hitArea = hitArea;
}