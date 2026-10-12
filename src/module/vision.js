import { MODULE_ID } from './constants.js';
import { isHexGrid } from './token.js';

/* original function
  _getVisionSourceData() {
    const {x, y, elevation} = this.document.getVisionOrigin();
    const {level, rotation, sight} = this.document;
    return {
      x, y, elevation, level, rotation,
      radius: this.sightRange,
      lightRadius: this.lightPerceptionRange,
      externalRadius: this.externalRadius,
      angle: sight.angle,
      contrast: sight.contrast,
      saturation: sight.saturation,
      brightness: sight.brightness,
      attenuation: sight.attenuation,
      visionMode: sight.visionMode,
      color: sight.color,
      preview: this.isPreview,
      disabled: this.#isUnreachableDragPreview
    };
  }
  */
export function _getVisionSourceData() {
  const d = canvas.dimensions;
  const { x, y, elevation } = this.document.getVisionOrigin();

  const GURPSMovementEnabled = game.settings.get(MODULE_ID, 'GURPSMovementEnabled');
  const anchorY = GURPSMovementEnabled
    ? this.document.gurpsGridless?.anchorY ?? this.document.texture.anchorY
    : this.document.texture.anchorY;

  const length = GURPSMovementEnabled
    ? this.document.flags[MODULE_ID]?.tokenLength ?? this.document.height
    : this.document.height;

  const radius =
    isHexGrid() ?? GURPSMovementEnabled
      ? this.externalRadius * (length + (anchorY - 0.5) * 2 ?? 1)
      : this.h * anchorY ?? this.externalRadius;

  const { rotation, sight, level } = this.document;
  return {
    x,
    y,
    elevation,
    level,
    rotation,
    radius: Math.clamp(this.sightRange, 0, d.maxR),
    lightRadius: Math.clamp(this.lightPerceptionRange, 0, d.maxR),
    externalRadius: radius, //this.externalRadius,
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
