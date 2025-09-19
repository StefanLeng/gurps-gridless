import { MODULE_ID } from './constants.js';
import { toggleRotationOnMovement, retreat } from './toggleRotation.js';

export async function setTokenDimensions(tokenDokument, length, width) {
  await tokenDokument.setFlag(MODULE_ID, 'tokenLength', length);
  await tokenDokument.setFlag(MODULE_ID, 'tokenWidth', width);
}

export async function setTokenOffsetX(tokenDokument, offset) {
  await tokenDokument.setFlag(MODULE_ID, 'tokenOffsetX', offset);
}

export async function setTokenOffsetY(tokenDokument, offset) {
  await tokenDokument.setFlag(MODULE_ID, 'tokenOffsetY', offset);
}

export async function setTokenScale(tokenDokument, scale) {
  await tokenDokument.setFlag(MODULE_ID, 'tokenScaling', scale);
}

export async function setTokenImageOffsetX(tokenDokument, offset) {
  await tokenDokument.setFlag(MODULE_ID, 'tokenImageOffsetX', offset);
}

export async function setTokenImageOffsetY(tokenDokument, offset) {
  await tokenDokument.setFlag(MODULE_ID, 'tokenImageOffsetY', offset);
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
