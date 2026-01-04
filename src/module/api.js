import { MODULE_ID } from './constants.js';
import { toggleRotationOnMovement, retreat } from './toggleRotation.js';

export async function setTokenDimensions(tokenDocument, length, width) {
  await tokenDocument.setFlag(MODULE_ID, 'tokenLength', length);
  await tokenDocument.setFlag(MODULE_ID, 'tokenWidth', width);
}

export async function setTokenOffsetX(tokenDocument, offset) {
  await tokenDocument.setFlag(MODULE_ID, 'tokenOffsetX', offset);
}

export async function setTokenOffsetY(tokenDocument, offset) {
  await tokenDocument.setFlag(MODULE_ID, 'tokenOffsetY', offset);
}

export async function setTokenScale(tokenDocument, scale) {
  await tokenDocument.setFlag(MODULE_ID, 'tokenScaling', scale);
}

export async function setTokenImageOffsetX(tokenDocument, offset) {
  await tokenDocument.setFlag(MODULE_ID, 'tokenImageOffsetX', offset);
}

export async function setTokenImageOffsetY(tokenDocument, offset) {
  await tokenDocument.setFlag(MODULE_ID, 'tokenImageOffsetY', offset);
}

export const gurpsGridlessAPI = {
  setTokenDimensions,
  setTokenOffsetX,
  setTokenOffsetY,
  setTokenScale,
  setTokenImageOffsetX,
  setTokenImageOffsetY,
  toggleRotationOnMovement,
  retreat,
};
