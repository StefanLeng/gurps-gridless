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

function offAxisLength(length) {
  if (isHexRowGrid()) {
    return length * (3 / 8) * Math.sqrt(3) + length / 8;
  } else {
    return length * (1 / 8) * Math.sqrt(3) + length * (6 / 8);
  }
}
/*
    When foundry messures of the main axis of a hex grid, then it aprocimate the hex shape as a rectagle and uses an inperfect formula for the length.
    This leads to incorrect scaling and will trow off our calculations and is visualy unappealing. So we need to correct the scaling.
    That happens with fit by height on hex rows or fit by width on hex columns.
*/
function boxFitting(length) {
  return (length / (length * 0.75 + 0.25)) * (Math.sqrt(3) / 2);
}

function calcRowScaleCorrection(length, fit) {
  if ((fit === 'height' && isHexRowGrid()) || (fit === 'width' && isHexColumnGrid())) {
    return boxFitting(length);
  } else {
    return 1;
  }
}

function calcOffsetFromFront(ln, s, hOffset) {
  return 0.5 + (0.5 - hOffset / ln) / s;
}

function calcOffsetFromCenter(ln, s, hOffset) {
  return 0.5 + hOffset / ln / s;
}

/*
    Offest the token so that the middle front hex is on the center of rotation.
    Note that in token space, the front is always down.
    We hafe to take the scale into account, because foundry will scale from the offset and we need to corrcet for that.
*/
function calcTokenHexOffset(
  width,
  length,
  scaling,
  hexDim,
  offsetY,
  offsetX,
  imageOffsetY,
  imageOffsetX,
  lookedRotation,
) {
  const roundedWidth = Math.round(width);
  const roundedLength = Math.round(length);
  const roundedOffsetY = Math.round(offsetY ?? 0);
  const roundedOffsetX = Math.round(offsetX ?? 0);
  //set the rotation center a half hex from the front (For odd length)
  const hOffset = Math.max(hexDim - roundedLength, 0) * 0.5 + 0.5 - roundedOffsetY;
  //set the rotation center a half hex to the side of the center for even width
  const wOffset =
    offAxisLength(roundedOffsetX) + (roundedWidth % 2 === 0 ? (roundedWidth <= roundedLength ? 0.5 : -0.5) : 0);

  return {
    x: calcOffsetFromCenter(hexDim, scaling, wOffset),
    y: calcOffsetFromFront(hexDim, scaling, hOffset),
    ix: lookedRotation
      ? calcOffsetFromCenter(hexDim, scaling, imageOffsetX)
      : calcOffsetFromCenter(hexDim, scaling, wOffset + imageOffsetX),
    iy: lookedRotation
      ? calcOffsetFromCenter(hexDim, scaling, imageOffsetY)
      : calcOffsetFromFront(hexDim, scaling, hOffset + imageOffsetY),
  };
}

function calcTokenOffset(width, length, scaling, offsetY, offsetX, imageOffsetY, imageOffsetX, lookedRotation) {
  const hOffset = Math.min(0.5, length / 2) - (offsetY ?? 0);
  return {
    x: calcOffsetFromCenter(width, scaling, offsetX ?? 0),
    y: calcOffsetFromFront(length, scaling, hOffset),
    ix: lookedRotation
      ? calcOffsetFromCenter(width, scaling, imageOffsetX)
      : calcOffsetFromCenter(width, scaling, (offsetX ?? 0) + imageOffsetX),
    iy: lookedRotation
      ? calcOffsetFromCenter(length, scaling, imageOffsetY)
      : calcOffsetFromFront(length, scaling, hOffset + imageOffsetY),
  };
}

export function makeTokenUpdates(
  width,
  length,
  scaling,
  fit,
  tokenDocument,
  offsetY,
  offsetX,
  imageOffsetY,
  imageOffsetX,
) {
  let changes = {};
  let offset;
  if (isHexGrid()) {
    const hexDim = calcTokenHexDim(width, length);
    const hexScaling = calcTokenHexScale(width, length, scaling, fit);
    offset = calcTokenHexOffset(
      width,
      length,
      hexScaling * (fit === 'width' ? (isHexColumnGrid() ? boxFitting(hexDim) : 1 / boxFitting(hexDim)) : 1), // I have no idea why this correction is needed, but it is ...
      hexDim,
      offsetY,
      offsetX,
      imageOffsetY,
      imageOffsetX,
      tokenDocument.lockRotation,
    );

    changes = {
      height: hexDim,
      width: hexDim,
      texture: {
        scaleX: hexScaling * calcRowScaleCorrection(hexDim, fit),
        scaleY: hexScaling * calcRowScaleCorrection(hexDim, fit),
        anchorY: offset.iy,
        anchorX: offset.ix,
      },
    };
  } else {
    offset = calcTokenOffset(
      width,
      length,
      scaling,
      offsetY,
      offsetX,
      imageOffsetY,
      imageOffsetX,
      tokenDocument.lockRotation,
    );

    changes = {
      height: length,
      width: width,
      texture: {
        scaleX: scaling,
        scaleY: scaling,
        anchorY: offset.iy,
        anchorX: offset.ix,
      },
    };
  }

  tokenDocument.gurpsGridless = {
    anchorX: offset.x,
    anchorY: offset.y,
  };

  return changes;
}

export function setTokenDimensions(tokenDocument) {
  if (!game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) return;

  const width = tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width;
  const length = tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height;
  const scaling = tokenDocument.flags[MODULE_ID]?.tokenScaling ?? tokenDocument?.texture?.scaleX ?? 1;
  const offsetY = tokenDocument.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const offsetX = tokenDocument.flags[MODULE_ID]?.tokenOffsetX ?? 0;
  const imageOffsetY = tokenDocument.flags[MODULE_ID]?.tokenImageOffsetY ?? 0;
  const imageOffsetX = tokenDocument.flags[MODULE_ID]?.tokenImageOffsetX ?? 0;
  const fit = scalingsDim(width, length, tokenDocument.texture?.fit ?? 'height');

  const newChanges = makeTokenUpdates(
    width,
    length,
    scaling,
    fit,
    tokenDocument,
    offsetY,
    offsetX,
    imageOffsetY,
    imageOffsetX,
  );

  tokenDocument.update(newChanges);
}

export function setTokenDimensionsonUpdate(tokenDocument, changes) {
  if (!game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) return;

  const width =
    changes?.flags?.[MODULE_ID]?.tokenWidth ?? tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width;
  const length =
    changes?.flags?.[MODULE_ID]?.tokenLength ?? tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height;
  const scaling =
    changes?.flags?.[MODULE_ID]?.tokenScaling ??
    tokenDocument.flags[MODULE_ID]?.tokenScaling ??
    tokenDocument?.texture?.scaleX ??
    1;
  const offsetY = changes?.flags?.[MODULE_ID]?.tokenOffsetY ?? tokenDocument.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const offsetX = changes?.flags?.[MODULE_ID]?.tokenOffsetX ?? tokenDocument.flags[MODULE_ID]?.tokenOffsetX ?? 0;
  const imageOffsetY =
    changes?.flags?.[MODULE_ID]?.tokenImageOffsetY ?? tokenDocument.flags[MODULE_ID]?.tokenImageOffsetY ?? 0;
  const imageOffsetX =
    changes?.flags?.[MODULE_ID]?.tokenImageOffsetX ?? tokenDocument.flags[MODULE_ID]?.tokenImageOffsetX ?? 0;
  const fit = scalingsDim(width, length, changes?.texture?.fit ?? tokenDocument.texture?.fit ?? 'height');

  const newChanges = makeTokenUpdates(
    width,
    length,
    scaling,
    fit,
    tokenDocument,
    offsetY,
    offsetX,
    imageOffsetY,
    imageOffsetX,
  );

  foundry.utils.mergeObject(changes, newChanges);
}

export function setTokenDimesionsOnCreate(tokenDocument, data) {
  if (!game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) return;

  const width = data.flags[MODULE_ID]?.tokenWidth ?? data.width ?? 1;
  const length = data.flags[MODULE_ID]?.tokenLength ?? data.height ?? 1;
  const scaling = data.flags[MODULE_ID]?.tokenScaling ?? data.texture?.scaleX ?? 1;
  const offsetY = data.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const offsetX = data.flags[MODULE_ID]?.tokenOffsetx ?? 0;
  const imageOffsetY = data.flags[MODULE_ID]?.tokenImageOffsetY ?? 0;
  const imageOffsetX = data.flags[MODULE_ID]?.tokenImageOffsetX ?? 0;
  const fit = scalingsDim(width, length, data.texture?.fit ?? 'height');
  const origOffsetX = data.texture?.offset?.x ?? 0.5;
  const origOffsetY = data.texture?.offset?.y ?? 0.5;

  const flags = {};
  flags[MODULE_ID] = {
    tokenWidth: width,
    tokenLength: length,
    tokenScaling: scaling,
    tokenOffsetY: 0,
    tokenOrigOffsetX: origOffsetX,
    tokenOrigOffsetY: origOffsetY,
    tokenImageOffsetY: imageOffsetY,
    tokenImageOffsetX: imageOffsetX,
  };

  const newData = makeTokenUpdates(
    width,
    length,
    scaling,
    fit,
    tokenDocument,
    offsetY,
    offsetX,
    imageOffsetY,
    imageOffsetX,
  );

  newData.flags = flags;

  tokenDocument.updateSource(newData);
}

export function setTokenDimesionsOnEnable(tokenDocument) {
  const width = tokenDocument.width ?? 1;
  const length = tokenDocument.height ?? 1;
  const scaling = tokenDocument.texture?.scaleX ?? 1;
  const offsetY = tokenDocument.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const offsetX = tokenDocument.flags[MODULE_ID]?.tokenOffsetx ?? 0;
  const imageOffsetY = tokenDocument.flags[MODULE_ID]?.tokenImageOffsetY ?? 0;
  const imageOffsetX = tokenDocument.flags[MODULE_ID]?.tokenImageOffsetX ?? 0;
  const fit = scalingsDim(width, length, tokenDocument.texture?.fit ?? 'height');
  const origOffsetX = tokenDocument.texture?.offset?.x ?? 0.5;
  const origOffsetY = tokenDocument.texture?.offset?.y ?? 0.5;

  const flags = {};
  flags[MODULE_ID] = {
    tokenWidth: width,
    tokenLength: length,
    tokenScaling: scaling,
    tokenOffsetY: 0,
    tokenOrigOffsetX: origOffsetX,
    tokenOrigOffsetY: origOffsetY,
    tokenImageOffsetY: imageOffsetY,
    tokenImageOffsetX: imageOffsetX,
  };

  const changes = makeTokenUpdates(
    width,
    length,
    scaling,
    fit,
    tokenDocument,
    offsetY,
    offsetX,
    imageOffsetY,
    imageOffsetX,
  );

  changes.flags = flags;

  tokenDocument.update(changes);
}

export function resetTokenDimensionsOnDisable(tokenDocument) {
  const width = tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width ?? 1;
  const length = tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height ?? 1;
  const scaling = tokenDocument.flags[MODULE_ID]?.tokenScaling ?? tokenDocument.texture?.scaleX ?? 1;
  const offsetY = tokenDocument.flags[MODULE_ID]?.tokenOrigOffsetY ?? tokenDocument.texture?.offset?.x ?? 0.5;
  const offsetX = tokenDocument.flags[MODULE_ID]?.tokenOrigOffsetX ?? tokenDocument.texture?.offset?.x ?? 0.5;

  let changes = {
    height: length,
    width: width,
    texture: {
      scaleX: scaling,
      scaleY: scaling,
      anchorX: offsetY,
      anchorY: offsetX,
    },
  };

  tokenDocument.update(changes);
}
