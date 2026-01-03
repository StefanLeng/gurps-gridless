import { doborder } from './borders';
import { getDirection, normalizeAngle, rotatePoint } from './rotation';
import { isHexGrid } from './token';
import { MODULE_ID } from './constants.js';

const closeRangeTreshold = 0.5;

function tokensInCloseRange(tokenDocument) {
  return tokenDocument.parent.tokens.filter(
    (v) => v.uuid != tokenDocument.uuid && canvas.grid.measurePath([v, tokenDocument]).distance < closeRangeTreshold,
  );
}

function tokensInCloseRangeAt(tokenDocument, x, y) {
  const result = tokenDocument.parent.tokens.filter(
    (v) =>
      v.uuid != tokenDocument.uuid &&
      canvas.grid.measurePath([
        { x: v.x, y: v.y },
        { x: x, y: y },
      ]).distance < closeRangeTreshold,
  );
  result.push(tokenDocument);
  return result;
}

function calculateShift2(tokenDocuments, getTokenDirection) {
  /* 
  for each group of tokens with the same starting angle find the optimal starting position,
  so that no token has the same angle and, if enough space, it gets shifted backwards.
  Assumes tokenDokuments are sorted be direction and spacingAngle * tokenDocuments.lenght <= 360
  */
  function calcFacingGroups(tokenDocuments, spacingAngle) {
    let d = tokenDocuments
      .map((v) => getTokenDirection(v))
      .reduce(
        (m, v) => {
          m.data[v] = m.data[v] ?? { count: 0 };
          m.data[v].count++;
          if (m.data[v].count === 1) {
            m.last = v > m.last ? v : m.last + spacingAngle;
            m.data[v].start = m.last;
          } else {
            m.last = m.last + spacingAngle;
          }
          return m;
        },
        { data: {}, last: -spacingAngle },
      );
    if (d.last >= 360) {
      let last = d.last - 360;
      Object.values(d.data).forEach((v) => {
        v.start = v.start > last ? v.start : last + spacingAngle;
        last = v.start + (v.count - 1) * spacingAngle;
        v.start = v.start % 360;
      });
    }
    return d.data;
  }

  const shiftLength = game.settings.get(MODULE_ID, 'tokenShiftDistance') ?? 0.4;
  const noShift = { x: 0, y: 0 };
  const standardShift = { x: 0, y: shiftLength * canvas.grid.sizeY };
  if (tokenDocuments.length === 0) {
    return;
  }
  if (tokenDocuments.length === 1) {
    tokenDocuments[0].gurpsGridless = foundry.utils.mergeObject(tokenDocuments[0].gurpsGridless ?? {}, {
      shift: noShift,
      shiftAngle: 0,
      shiftDist: 0,
    });
    doborder(tokenDocuments[0].object);
  } else {
    tokenDocuments.sort((a, b) => getTokenDirection(a) - getTokenDirection(b));
    let spacingAngle = 360 / Math.max(tokenDocuments.length, 6);
    let groups = calcFacingGroups(tokenDocuments, spacingAngle);
    let last;
    let i = 0;
    tokenDocuments.forEach((element) => {
      const dir = getTokenDirection(element);
      i = dir !== last ? 0 : i + 1;
      let shiftDir = groups[dir].start + i * spacingAngle;
      let rot = shiftDir - dir;
      element.gurpsGridless = foundry.utils.mergeObject(element.gurpsGridless ?? {}, {
        shift: rotatePoint(standardShift, rot),
        shiftAngle: rot,
        shiftDist: shiftLength * canvas.grid.sizeY,
      });
      doborder(element.object);
      last = dir;
    });
  }
}

export function applyCloseRangeShift(tokenDocument, updates, initial) {
  if (!isHexGrid() || !(game.settings.get(MODULE_ID, 'shiftTokensinSameHex') ?? false)) {
    return;
  }
  const { x: oldX, y: oldY } = tokenDocument;
  const { x: updateX, y: updateY } = updates;
  const newX = updateX ?? oldX;
  const newY = updateY ?? oldY;
  if (newY === oldY && newX === oldX && !initial) return;

  const oldTokensInRange = tokensInCloseRange(tokenDocument);
  calculateShift2(oldTokensInRange, (d) => normalizeAngle(getDirection(d.object)));

  const newTokensInRange = tokensInCloseRangeAt(tokenDocument, newX, newY);
  calculateShift2(newTokensInRange, (d) =>
    normalizeAngle(d.uuid === tokenDocument.uuid ? updates.rotation ?? tokenDocument.rotation : getDirection(d.object)),
  );
}
