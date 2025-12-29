import { getDirection } from './rotation.js';
import { MODULE_ID } from './constants.js';

export function _getVisionSourceData() {
  const d = canvas.dimensions;
  let { x, y } = this.center;

  let anchorX, anchorY;
  if (this.document.gurpsGridless) {
    ({ anchorX, anchorY } = this.document.gurpsGridless);
  } else {
    ({ anchorX, anchorY } = this.document.texture);
  }

  const { scaleX, scaleY } = this.document.texture;

  const { w: width, h: height } = this;

  const angle = (getDirection(this) / 180) * Math.PI;
  let mat = new PIXI.Matrix(); //eslint-disable-line no-undef
  mat.rotate(angle).translate(x, y);

  const offset = new PIXI.Point(-width * (anchorX - 0.5) * scaleX, -height * (anchorY - 0.5) * scaleY); //eslint-disable-line no-undef
  const offsetT = mat.apply(offset);

  x = offsetT.x;
  y = offsetT.y;

  const { elevation, rotation } = this.document;
  const sight = this.document.sight;
  return {
    x,
    y,
    elevation,
    rotation,
    radius: Math.clamp(this.sightRange, 0, d.maxR),
    lightRadius: Math.clamp(this.lightPerceptionRange, 0, d.maxR),
    externalRadius: this.externalRadius,
    angle: sight.angle,
    contrast: sight.contrast,
    saturation: sight.saturation,
    brightness: sight.brightness,
    attenuation: sight.attenuation,
    visionMode: sight.visionMode,
    color: sight.color,
    preview: this.isPreview,
    disabled: false,
  };
}

export function setVisionAdjustment(enabled) {
  if (typeof libWrapper === 'function') {
    if (enabled) {
      libWrapper.register(MODULE_ID, 'Token.prototype._getVisionSourceData', _getVisionSourceData, 'MIXED'); //eslint-disable-line no-undef
    } else {
      libWrapper.unregister_all(MODULE_ID); //eslint-disable-line no-undef
    }
  }
}
