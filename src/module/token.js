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

function scalingsDim(width, length, fit) {
  const dim =
    fit === 'contain'
      ? width < length
        ? 'width'
        : 'height'
      : fit === 'cover'
      ? width > length
        ? 'width'
        : 'height'
      : fit === 'fill'
      ? width < length
        ? 'width'
        : 'height'
      : fit;
  return dim;
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
    When foundry messures of the main axis of a hex grid, then it aprocimate the hex shape as a rectagle and uses an inperfect formula for the length.
    This leads to incorrect sscaling and will trow off our calculations and is visualy unappealing. So we need to correct the scaling.
    That happens when wei fit be height on hex rows or fit by width on hex columns.
*/
function calcRowScaleCorrection(token, length, fit) {
  if ((fit === 'height' && isHexRowGrid()) || (fit === 'width' && isHexColumnGrid())) {
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
  //set the rotation center a half hex to the side of the center for even width
  const wOffset = roundedWidth % 2 === 0 ? (roundedWidth <= roundedLength ? 0.5 : -0.5) : 0;

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

export function makeTokenUpdates(width, length, scaling, fit, tokenDocument) {
  let changes = {};
  if (isHexGrid()) {
    const hexDim = calcTokenHexDim(width, length);
    const hexScaling = calcTokenHexScale(width, length, scaling, fit);
    const offset = calcTokenHexOffset(width, length, hexScaling, hexDim);

    changes = {
      height: hexDim,
      width: hexDim,
      texture: {
        scaleX: hexScaling * calcRowScaleCorrection(tokenDocument, hexDim, fit),
        scaleY: hexScaling * calcRowScaleCorrection(tokenDocument, hexDim, fit),
        anchorX: offset.x,
        anchorY: offset.y,
      },
    };
  } else {
    const offset = calcTokenOffset(width, length, scaling);
    changes = {
      height: length,
      width: width,
      texture: {
        scaleX: scaling,
        scaleY: scaling,
        anchorX: offset.x,
        anchorY: offset.y,
      },
    };
  }
  return changes;
}

export function setTokenDimensions(tokenDocument) {
  const width = tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width;
  const length = tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height;
  const scaling = tokenDocument.flags[MODULE_ID]?.tokenScaling ?? tokenDocument?.texture?.scaleX ?? 1;
  const fit = scalingsDim(width, length, tokenDocument.texture?.fit ?? 'height');

  const newChanges = makeTokenUpdates(width, length, scaling, fit, tokenDocument);
  tokenDocument.update(newChanges);
}

export function setTokenDimensionsonUpdate(tokenDocument, changes) {
  const width =
    changes?.flags?.[MODULE_ID]?.tokenWidth ?? tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width;
  const length =
    changes?.flags?.[MODULE_ID]?.tokenLength ?? tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height;
  const scaling =
    changes?.flags?.[MODULE_ID]?.tokenScaling ??
    tokenDocument.flags[MODULE_ID]?.tokenScaling ??
    tokenDocument?.texture?.scaleX ??
    1;
  const fit = scalingsDim(width, length, changes?.texture?.fit ?? tokenDocument.texture?.fit ?? 'height');

  const newChanges = makeTokenUpdates(width, length, scaling, fit, tokenDocument);
  foundry.utils.mergeObject(changes, newChanges);
}

export function setTokenDimesnionsOnCreate(tokenDocument, data) {
  const width = data.flags[MODULE_ID]?.tokenWidth ?? data.width ?? 1;
  const length = data.flags[MODULE_ID]?.tokenLength ?? data.height ?? 1;
  const scaling = data.flags[MODULE_ID]?.tokenScaling ?? data.texture?.scaleX ?? 1;
  const fit = scalingsDim(width, length, data.texture?.fit ?? 'height');
  const flags = {};
  flags[MODULE_ID] = {
    tokenWidth: width,
    tokenLength: length,
    tokenScaling: scaling,
  };

  const newData = makeTokenUpdates(width, length, scaling, fit, tokenDocument);
  newData.flags = flags;
  tokenDocument.updateSource(newData);
}
