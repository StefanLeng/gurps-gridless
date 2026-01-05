import { getDirection, toRadians } from './rotation.js';
import { isHexGrid } from './token.js';
import { MODULE_ID } from './constants.js';
import { doHexBodyShape } from './shapes.js';
const PIXI = window.PIXI;

function rectangleHitArea(token) {
  const { w: width, h: height } = token;
  return [new PIXI.Point(0, 0), new PIXI.Point(width, 0), new PIXI.Point(width, height), new PIXI.Point(0, height)];
}

function hexHitArea(token) {
  const { w: widthPx, h: heightPx } = token;
  let points = [];

  let f = (x, y) => {
    points.push(new PIXI.Point(x + widthPx / 2, y + heightPx / 2));
  };

  doHexBodyShape(token.document.flags[MODULE_ID]?.tokenWidth, token.document.flags[MODULE_ID]?.tokenLength, f);

  return points;
}

export function drawHitArea(token) {
  const points =
    isHexGrid() && game.settings.get(MODULE_ID, 'GURPSMovementEnabled') ? hexHitArea(token) : rectangleHitArea(token);

  const { w: width, h: height } = token;
  let anchorX, anchorY;
  if (token.document.gurpsGridless?.anchorY) {
    ({ anchorX, anchorY } = token.document.gurpsGridless);
  } else {
    ({ anchorX, anchorY } = token.document.texture);
  }
  const tokenDirection = toRadians(getDirection(token));

  const mat = new PIXI.Matrix();
  const shift = token.document.gurpsGridless?.shift ?? { x: 0, y: 0 };
  // eslint-disable-next-line prettier/prettier
  mat.translate(
    -width * (0.5 + (anchorX - 0.5)) - shift.x,
    -height * (0.5 + (anchorY - 0.5)) - shift.y,
  );
  mat.rotate(tokenDirection);
  mat.translate(width * 0.5, height * 0.5);

  const rotatedPoints = points.map((p) => mat.apply(p));

  const hitArea = new PIXI.Polygon(rotatedPoints);
  token.shape = hitArea;
  token.hitArea = hitArea;
}
