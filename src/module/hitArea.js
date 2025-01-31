//import { MODULE_ID } from './constants.js';
import { getDirectionFromAbautFace } from './rangeindicator.js';
import { isHexGrid } from './token.js';
import { MODULE_ID } from './constants.js';
import { doHexBodyShape } from './shapes.js';

function rectangelHitArea(token) {
  const { w: width, h: height } = token;
  return [
    new PIXI.Point(0, 0), //eslint-disable-line no-undef
    new PIXI.Point(width, 0), //eslint-disable-line no-undef
    new PIXI.Point(width, height), //eslint-disable-line no-undef
    new PIXI.Point(0, height), //eslint-disable-line no-undef
  ];
}

function hexHitArea(token) {
  const { w: widthpx, h: heightpx } = token;
  let points = [];

  let f = (x, y) => {
    points.push(new PIXI.Point(x + widthpx / 2, y + heightpx / 2)); //eslint-disable-line no-undef
  };

  doHexBodyShape(token.document.flags[MODULE_ID]?.tokenWidth, token.document.flags[MODULE_ID]?.tokenLength, f);

  return points;
}

export function drawHitArea(token) {
  const points =
    isHexGrid() && game.settings.get(MODULE_ID, 'GURPSMovementEnabled') ? hexHitArea(token) : rectangelHitArea(token);

  const { w: width, h: height } = token;
  const { scaleY, scaleX } = token.document.texture;
  let anchorX, anchorY;
  if (token.document.gurpsGridless) {
    ({ anchorX, anchorY } = token.document.gurpsGridless);
  } else {
    ({ anchorX, anchorY } = token.document.texture);
  }
  const tokenDirectionDegree = getDirectionFromAbautFace(token);
  const tokenDirection = (tokenDirectionDegree / 180) * Math.PI;

  var mat = new PIXI.Matrix(); //eslint-disable-line no-undef
  mat.translate(-width * (0.5 + (anchorX - 0.5) * scaleX), -height * (0.5 + (anchorY - 0.5) * scaleY));
  mat.rotate(tokenDirection);
  mat.translate(width * 0.5, height * 0.5);

  const rotatedPoints = points.map((p) => mat.apply(p));

  const hitArea = new PIXI.Polygon(rotatedPoints); //eslint-disable-line no-undef
  token.shape = hitArea;
  token.hitArea = hitArea;
}
