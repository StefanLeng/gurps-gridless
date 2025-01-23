import { MODULE_ID } from './constants.js';

export function isHexRowGrid() {
  return canvas.grid.type === CONST.GRID_TYPES.HEXODDR || canvas.grid.type === CONST.GRID_TYPES.HEXEVENR;
}

export function isHexColumnGrid() {
  return canvas.grid.type === CONST.GRID_TYPES.HEXODDQ || canvas.grid.type === CONST.GRID_TYPES.HEXEVENQ;
}

export function isHexGrid() {
  return isHexRowGrid() || isHexColumnGrid();
}

/*
    We need a odd number of hexes, so that the center of the shape is a hex center
*/
function calcTokenHexDim(width, length) {
  const maxDim = Math.max(Math.round(width), Math.round(length));
  return maxDim % 2 === 0 ? maxDim + 1 : maxDim;
}

/*
    wen need to correct for the addition hex on even hex number by additional scaling
*/
function calcTokenHexScale(width, length, scaling, fit) {
  const dim = calcTokenHexDim(width, length);
  const l = fit === 'height' ? Math.round(length) : Math.round(width);
  return (scaling * l) / dim;
}

/*
    When foundry messures of the main axis of a hex grid, then it aprocimate the hex shape as a rectagle and uses an inoerfect formula afro the length.
    This leads to incorrect sscaling and will trow off our calculations and is visualy unappealing. So we need to correct the scaling.
    That happens when wei fit be height on hex rows or fit by width on hex columns.
*/
function calcRowScaleCorrection(token, length) {
  if ((token.texture.fit === 'height' && isHexRowGrid()) || (token.texture.fit === 'width' && isHexColumnGrid())) {
    return (length / (length * 0.75 + 0.25)) * (Math.sqrt(3) / 2);
  } else {
    return 1;
  }
}

/*
    Offest the token so that the middle front hex is on the center of rotation.
    Note that in token space, the front is always down.
    We hafe to take the scale into account, because foundry will scale from the offset and we need to corrcet for that.
*/
function calcTokenHexOffset(width, length, scaling, hexDim) {
  const roundedWidth = Math.round(width);
  const roundedLength = Math.round(length);
  //set the rotation center a half hex from the front (For odd length)
  const hOffset = Math.max(hexDim - roundedLength, 0) * 0.5 + 0.5;
  //set the rotation center a half hex left of the center for even width
  const wOffset = roundedWidth % 2 === 0 ? -0.5 : 0;

  return { x: calcOffsetFromCenter(hexDim, scaling, wOffset), y: calcOffsetFromFront(hexDim, scaling, hOffset) };

  function calcOffsetFromFront(ln, s, hOffset) {
    return 0.5 + (0.5 - hOffset / ln) / s;
  }
  function calcOffsetFromCenter(ln, s, hOffset) {
    return 0.5 + hOffset / ln / s;
  }
}

function calcTokenOffset(width, length, scaling) {
  return { x: 0.5, y: calcOffset(length, scaling) };

  //set the rotation center a half hex from the front (For odd length)
  function calcOffset(ln, s) {
    return 0.5 + (0.5 - 0.5 / ln) / s;
  }
}

export function setTokenDimensions(tokenDokument, changes) {
  const width = changes.flags[MODULE_ID]?.tokenWidth ?? tokenDokument.flags[MODULE_ID]?.tokenWidth ?? 1;
  const length = changes.flags[MODULE_ID]?.tokenLength ?? tokenDokument.flags[MODULE_ID]?.tokenLength ?? 1;
  const scaling = changes.flags[MODULE_ID]?.tokenScaling ?? tokenDokument.flags[MODULE_ID]?.tokenScaling ?? 1;

  if (isHexGrid()) {
    const hexDim = calcTokenHexDim(width, length);
    const hexScaling = calcTokenHexScale(width, length, scaling, tokenDokument.texture.fit);
    const offset = calcTokenHexOffset(width, length, hexScaling, hexDim);

    const newChanges = {
      height: hexDim,
      width: hexDim,
      texture: {
        scaleX: hexScaling * calcRowScaleCorrection(tokenDokument, hexDim),
        scaleY: hexScaling * calcRowScaleCorrection(tokenDokument, hexDim),
        anchorX: offset.x,
        anchorY: offset.y,
      },
    };
    foundry.utils.mergeObject(changes, newChanges);
  } else {
    const offset = calcTokenOffset(width, length, scaling);
    const newChanges = {
      height: length,
      width: width,
      texture: {
        scaleX: scaling,
        scaleY: scaling,
        anchorX: offset.x,
        anchorY: offset.y,
      },
    };
    foundry.utils.mergeObject(changes, newChanges);
  }
}

export function setTokenDimesnionsOnCreate(tokenDokument, data) {
  const width = data.flags[MODULE_ID]?.tokenWidth ?? data.width ?? 1;
  const length = data.flags[MODULE_ID]?.tokenLength ?? data.height ?? 1;
  const scaling = data.flags[MODULE_ID]?.tokenScaling ?? data.texture?.hexScaling ?? 1;
  const flags = {};
  flags[MODULE_ID] = {
    tokenWidth: width,
    tokenLength: length,
    tokenScaling: scaling,
  };
  if (isHexGrid()) {
    const hexDim = calcTokenHexDim(width, length);
    const hexScaling = calcTokenHexScale(width, length, scaling, tokenDokument.texture.fit);
    const offset = calcTokenHexOffset(width, length, hexScaling, hexDim);
    const newData = {
      height: hexDim,
      width: hexDim,
      flags: flags,
      texture: {
        scaleX: hexScaling * calcRowScaleCorrection(tokenDokument, hexDim),
        scaleY: hexScaling * calcRowScaleCorrection(tokenDokument, hexDim),
        anchorX: offset.x,
        anchorY: offset.y,
      },
    };
    tokenDokument.updateSource(newData);
  } else {
    const offset = calcTokenOffset(width, length, scaling);
    const newData = {
      height: length,
      width: width,
      flags: flags,
      texture: {
        scaleX: scaling,
        scaleY: scaling,
        anchorX: offset.x,
        anchorY: offset.y,
      },
    };
    tokenDokument.updateSource(newData);
  }
}
