export function getDirection(token) {
  return token.document.rotation;
}

function getGridType() {
  return Math.floor(canvas.grid.type / 2);
}

export function clipRotationToFaces(tokenDocument, updates) {
  const noRotation = updates.rotation === undefined || tokenDocument.rotation === updates.rotation;
  if (noRotation) return;
  if (!canvas.grid?.type) return;

  const tokenDirection = updates.rotation + 90;

  const directions = [
    [45, 90, 135, 180, 225, 270, 315, 360], // Square
    [0, 60, 120, 180, 240, 300, 360], // Hex Rows
    [30, 90, 150, 210, 270, 330, 390], // Hex Columns
  ];
  const gridType = getGridType();
  const facings = directions[gridType];
  if (facings && facings.length) {
    // convert negative dirs into a range from 0-360
    const normalizedDir = ((tokenDirection % 360) + 360) % 360; // Math.round(tokenDirection < 0 ? 360 + tokenDirection : tokenDirection);
    // find the largest normalized angle
    const secondAngle = facings.reduceRight((prev, curr) => (curr < prev && curr > normalizedDir ? curr : prev)); // facings.find((e) => e > normalizedDir);
    // and assume the facing is 60 degrees (hexes) or 45 (square) to the counter clockwise
    const nextTokenDirection = gridType ? secondAngle - 60 : secondAngle - 45;
    // unless the largest angle was closer
    const newTokenDirection =
      secondAngle - normalizedDir < normalizedDir - nextTokenDirection ? secondAngle : nextTokenDirection;
    // return tokenDirection to the range 180 to -180
    const finalTokenDirection = newTokenDirection > 180 ? newTokenDirection - 360 : newTokenDirection;
    // set new rotation
    updates.rotation = finalTokenDirection - 90;
  }
}
