export const MODULE_ID = 'gurps-gridless';

export const defaultColors = {
  lineAlpha: 1.0,
  fillAlpha: 0.2,
  lineColor: 0x000000,
  frontColor: 0x00ff00,
  sideColor: 0xffff00,
  backColor: 0xff0000,
  borderAlpha: 1.0,
  indicatorAlpha: 1.0,
  indicatorFillColor: '#000000',
  indicatorLineColor: '#ffffff',
};

export const faceAngels = {
  frontStart: 0,
  forward: Math.PI / 2,
  frontEnd: Math.PI,
  rightEnd: Math.PI + Math.PI / 3,
  backward: Math.PI + Math.PI / 2,
  backEnd: Math.PI + (Math.PI / 3) * 2,
  leftEnd: 2 * Math.PI,
};

export function getColorConfig() {
  const config = Object.assign({}, defaultColors);
  config.lineAlpha = game.settings.get(MODULE_ID, 'reachLineAlpha') ?? defaultColors.lineAlpha;
  config.fillAlpha = game.settings.get(MODULE_ID, 'facingAlpha') ?? defaultColors.fillAlpha;
  config.indicatorAlpha = game.settings.get(MODULE_ID, 'facingIndicatorAlpha') ?? defaultColors.indicatorAlpha;
  config.borderAlpha = game.settings.get(MODULE_ID, 'borderAlpha') ?? defaultColors.borderAlpha;
  config.indicatorFillColor =
    game.settings.get(MODULE_ID, 'facingIndicatorFillColor') ?? defaultColors.indicatorFillColor;
  config.indicatorLineColor =
    game.settings.get(MODULE_ID, 'facingIndicatorLineColor') ?? defaultColors.indicatorLineColor;
  return config;
}
