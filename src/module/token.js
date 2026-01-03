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
    scale for the immage from 1 hex to the real dimension
*/
function calcTokenHexScale(width, length, scaling, fit) {
  const l = fit === 'height' ? Math.round(length) : Math.round(width);
  return scaling * l;
}

/*
    factor (distance of an edge center to the hex center) / (distance of a corner to the hex center)
    note: the distance of a corner to the hex center is the same as an edge lengh
*/
const edgeFactor = Math.sqrt(3) / 2;

/*
    distance of hex centers ortogonal to the main hex direction in grid units as mesured in the main hex direction
    hexes is the distance in hexes
    The factor 0.75 is becus the hex Rows/colums overlap by 25%
*/
function hexCenterToHexCenterOnMinorAxis(hexes) {
  return (hexes * 0.75) / edgeFactor;
}

/*
    width of the bounding box ortogonal to the main hex direction in grid units as mesured in the main hex direction.
    the additional + 0.25 to the previous formula is because the bounding box inclued the overlaping part on boht edges.
*/
const hexBoundingBoxOnMinorAxis = 1 / edgeFactor;

/*
  Because on hex rows the token length is ortogonal to the hex main axis in token space, we have to correct for the boxFitting on hexRows
*/
function rowScaleCorrection() {
  if (isHexRowGrid()) {
    return edgeFactor;
  } else {
    return 1;
  }
}

function imageScaleCorrection(fit) {
  if ((isHexRowGrid() && fit === 'width') || (isHexColumnGrid() && fit === 'height')) {
    return 1 / edgeFactor;
  } else {
    return 1;
  }
}

function calcOffsetFromFront(lenght, scale, hOffset) {
  return 0.5 + (0.5 - hOffset / lenght) / scale;
}

function calcOffsetFromCenter(lenght, scale, hOffset) {
  return 0.5 + hOffset / lenght / scale;
}

/*
    Offest the token so that the middle front hex is on the center of rotation.
    We have to take the scale into account, because foundry will scale from the offset and we need to corrcet for that.
*/
function calcTokenHexOffset(length, scaling, offsetY, offsetX, imageOffsetY, imageOffsetX, lookedRotation) {
  const roundedLength = Math.round(length);
  const roundedOffsetY = Math.round(offsetY ?? 0);
  const roundedOffsetX = Math.round(offsetX ?? 0);
  //set the rotation center a half hex from the front (if the explicit offset is 0)
  const hOffset = -roundedLength * 0.5 + 1 - roundedOffsetY;

  //Because the widht is ortogonal to the hex main axis, we have to correct both the bounding box and the distance
  const wDim = hexBoundingBoxOnMinorAxis;
  const wOffset = hexCenterToHexCenterOnMinorAxis(roundedOffsetX);

  return {
    x: calcOffsetFromCenter(wDim, rowScaleCorrection(), wOffset),
    y: calcOffsetFromFront(1, 1 / rowScaleCorrection(), hOffset),
    ix: lookedRotation
      ? calcOffsetFromCenter(wDim, scaling, imageOffsetX * (3 / 2))
      : calcOffsetFromCenter(wDim, scaling, wOffset + imageOffsetX * (3 / 2)),
    iy: lookedRotation
      ? calcOffsetFromCenter(1, scaling, imageOffsetY)
      : calcOffsetFromFront(1, scaling, hOffset + imageOffsetY),
  };
}

function calcTokenOffset(width, length, scaling, offsetY, offsetX, imageOffsetY, imageOffsetX, lookedRotation) {
  const hOffset = Math.min(0.5, length / 2) - (offsetY ?? 0);
  return {
    x: calcOffsetFromCenter(width, 1, offsetX ?? 0),
    y: calcOffsetFromFront(length, 1, hOffset),
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
  oldWidth,
  oldLength,
  oldX,
  oldY,
) {
  let changes = {};
  let offset;
  if (isHexGrid()) {
    const hexScaling = calcTokenHexScale(width, length, scaling, fit);
    offset = calcTokenHexOffset(
      length,
      hexScaling,
      offsetY,
      offsetX,
      imageOffsetY,
      imageOffsetX,
      tokenDocument.lockRotation,
    );

    changes = {
      height: 1,
      width: 1,
      texture: {
        scaleX: hexScaling * imageScaleCorrection(fit),
        scaleY: hexScaling * imageScaleCorrection(fit),
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
    if (oldWidth && oldWidth !== width) {
      changes.x = Math.round(oldX - (width - oldWidth) * canvas.grid.sizeX * 0.5);
    }
    if (oldLength && oldLength !== length) {
      changes.y = Math.round(oldY - (length - oldLength) * canvas.grid.sizeY * 0.5);
    }
  }

  tokenDocument.gurpsGridless = foundry.utils.mergeObject(tokenDocument.gurpsGridless ?? {}, {
    anchorX: offset.x,
    anchorY: offset.y,
  });

  return changes;
}

export function setTokenDimensions(tokenDocument) {
  if (!game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) return;
  if (!tokenDocument.isOwner) return;

  let flags = {};
  flags[MODULE_ID] = {};
  if ((tokenDocument.flags?.[MODULE_ID]?.tokenWidth ?? 0) < 0.2) {
    flags[MODULE_ID].tokenWidth = 1;
  }
  if ((tokenDocument.flags?.[MODULE_ID]?.tokenLength ?? 0) < 0.2) {
    flags[MODULE_ID].tokenLength = 1;
  }
  if ((tokenDocument.flags?.[MODULE_ID]?.tokenScaling ?? 0) < 0.1) {
    flags[MODULE_ID].tokenScaling = 1;
  }

  const width = Math.max(tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width, 0.2);
  const length = Math.max(tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height, 0.2);
  const scaling = Math.max(tokenDocument.flags[MODULE_ID]?.tokenScaling ?? tokenDocument?.texture?.scaleX ?? 1, 0.1);
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

  newChanges.flags = flags;

  tokenDocument.update(newChanges);
}

export function setTokenDimensionsonUpdate(tokenDocument, changes, options) {
  if (!game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) return;

  if ((changes?.flags?.[MODULE_ID]?.tokenWidth ?? 1) < 0.2) {
    changes.flags[MODULE_ID].tokenWidth = 0.2;
  }
  if ((changes?.flags?.[MODULE_ID]?.tokenLength ?? 1) < 0.2) {
    changes.flags[MODULE_ID].tokenLength = 0.2;
  }
  if ((changes?.flags?.[MODULE_ID]?.tokenScaling ?? 1) < 0.1) {
    changes.flags[MODULE_ID].tokenScaling = 0.1;
  }

  const width = Math.max(
    changes?.flags?.[MODULE_ID]?.tokenWidth ?? tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width,
    0.2,
  );
  const length = Math.max(
    changes?.flags?.[MODULE_ID]?.tokenLength ?? tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height,
    0.2,
  );
  const scaling = Math.max(
    changes?.flags?.[MODULE_ID]?.tokenScaling ??
      tokenDocument.flags[MODULE_ID]?.tokenScaling ??
      tokenDocument?.texture?.scaleX ??
      1,
    0.1,
  );
  const offsetY = changes?.flags?.[MODULE_ID]?.tokenOffsetY ?? tokenDocument.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const offsetX = changes?.flags?.[MODULE_ID]?.tokenOffsetX ?? tokenDocument.flags[MODULE_ID]?.tokenOffsetX ?? 0;
  const imageOffsetY =
    changes?.flags?.[MODULE_ID]?.tokenImageOffsetY ?? tokenDocument.flags[MODULE_ID]?.tokenImageOffsetY ?? 0;
  const imageOffsetX =
    changes?.flags?.[MODULE_ID]?.tokenImageOffsetX ?? tokenDocument.flags[MODULE_ID]?.tokenImageOffsetX ?? 0;
  const fit = scalingsDim(width, length, changes?.texture?.fit ?? tokenDocument.texture?.fit ?? 'height');

  const oldLength = tokenDocument.flags[MODULE_ID]?.tokenLength ?? tokenDocument.height;
  const oldWidth = tokenDocument.flags[MODULE_ID]?.tokenWidth ?? tokenDocument.width;
  const oldY = changes?.y ?? tokenDocument.y;
  const oldX = changes?.x ?? tokenDocument.x;

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
    oldWidth,
    oldLength,
    oldX,
    oldY,
  );

  foundry.utils.mergeObject(changes, newChanges);

  if (width !== oldWidth || length !== oldLength) {
    options.animate = false;
  }
}

export function setTokenDimesionsOnCreate(tokenDocument, data) {
  if (!game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) return;

  const width =
    (data.flags[MODULE_ID]?.tokenWidth ?? data.width ?? 1) < 0.1
      ? 1
      : data.flags[MODULE_ID]?.tokenWidth ?? data.width ?? 1;
  const length =
    (data.flags[MODULE_ID]?.tokenLength ?? data.height ?? 1) < 0.1
      ? 1
      : data.flags[MODULE_ID]?.tokenLength ?? data.height ?? 1;
  const scaling =
    (data.flags[MODULE_ID]?.tokenScaling ?? data.texture?.scaleX ?? 1) < 0.1
      ? 1
      : data.flags[MODULE_ID]?.tokenScaling ?? data.texture?.scaleX ?? 1;
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
