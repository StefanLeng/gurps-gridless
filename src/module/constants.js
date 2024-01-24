export const MODULE_ID = 'gurps-gridless';

export const defaultColors = {
  lineAlpha: 1.0,
  fillAlpha: 0.2,
  lineColor: 0x000000,
  frontColor: 0x00ff00,
  sideColor: 0xffff00,
  backColor: 0xff0000,
};

export const faceAngels = {
  frontStart: 0,
  forward: Math.PI/2,
  frontEnd: Math.PI,
  rightEnd: Math.PI + Math.PI / 3,
  backward:  Math.PI + Math.PI/2,
  backEnd: Math.PI + (Math.PI / 3) * 2,
  leftEnd: 2 * Math.PI,
};
