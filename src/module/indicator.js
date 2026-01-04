import { MODULE_ID } from './constants.js';
import { isHexColumnGrid } from './token.js';

const PIXI = window.PIXI;

function drawDefaultArrow() {
  const lineColor = game.settings.get(MODULE_ID, 'facingIndicatorLineColor') ?? '#ffffff';
  const fillColor = game.settings.get(MODULE_ID, 'facingIndicatorFillColor') ?? '#000000';
  const indicator = new PIXI.Graphics();
  const halfSide = 25;
  const halfHeight = (halfSide * Math.sqrt(3)) / 3;
  indicator
    .lineStyle(3, lineColor, 1)
    .beginFill(fillColor)
    .moveTo(0, -halfHeight)
    .lineTo(-halfSide, -halfHeight)
    .lineTo(0, halfHeight)
    .lineTo(halfSide, -halfHeight)
    .lineTo(0, -halfHeight)
    .endFill();
  return indicator;
}

async function doIndicator(tokenDocument) {
  const { w: width, h: height } = tokenDocument.object;
  const indicatorOffset = game.settings.get(MODULE_ID, 'facingIndicatorGap') ?? 0.2;
  const tokenOffset = tokenDocument.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const container = tokenDocument.object.GURPSGridlessIndicator;
  const scaling =
    (game.settings.get(MODULE_ID, 'facingIndicatorScale') ?? 1) *
    (tokenDocument.flags[MODULE_ID]?.facingIndicatorScale ?? 1);
  const show = tokenDocument.flags[MODULE_ID]?.facingIndicatorEnabled ?? true;
  const indicatorImage =
    tokenDocument.flags[MODULE_ID]?.facingIndicatorImage?.trim() ?? '' !== ''
      ? tokenDocument.flags[MODULE_ID]?.facingIndicatorImage.trim()
      : game.settings.get(MODULE_ID, 'facingIndicatorImage')?.trim() ?? '' !== ''
      ? game.settings.get(MODULE_ID, 'facingIndicatorImage').trim()
      : 'modules/gurps-gridless/assets/simple_arrow.png';
  container.width = width;
  container.height = height;
  container.x = width / 2;
  container.y = height / 2;
  container.pivot.set(0.5);
  container.scale.set(1);
  if (container.imagePath !== indicatorImage) {
    container.removeChild(container.indicator);
    if (indicatorImage === 'modules/gurps-gridless/assets/simple_arrow.png') {
      container.indicator = drawDefaultArrow();
    } else {
      const texture = await PIXI.Assets.load(indicatorImage);
      container.indicator = new PIXI.Sprite(texture);
    }
    container.addChild(container.indicator);
    container.imagePath = indicatorImage;
  }
  const indicator = container.indicator;
  indicator.scale.set(scaling);
  const gridSize = isHexColumnGrid() ? canvas.grid.sizeY : canvas.grid.sizeX;
  const offset = gridSize * (0.5 - tokenOffset + indicatorOffset);
  indicator.y = offset;
  container.angle = tokenDocument.rotation;
  container.visible = show;
}

export function drawIndicator(token) {
  if (!(game.settings.get(MODULE_ID, 'showFacingIndicator') ?? true) || token.GURPSGridlessIndicator) return;
  token.GURPSGridlessIndicator = new PIXI.Container();
  token.addChild(token.GURPSGridlessIndicator);
  doIndicator(token.document);
}

export function updateIndicatorDirection(token) {
  if (!token?.GURPSGridlessIndicator) return;
  token.GURPSGridlessIndicator.angle = token.document.rotation;
}

export function updateIndicator(tokenDocument, changes) {
  if (!tokenDocument.object?.GURPSGridlessIndicator) return;
  if (
    changes.rotation === undefined &&
    changes.flags?.[MODULE_ID]?.tokenOffsetY === undefined &&
    changes.flags?.[MODULE_ID]?.facingIndicatorScale === undefined &&
    changes.flags?.[MODULE_ID]?.facingIndicatorEnabled === undefined &&
    changes.flags?.[MODULE_ID]?.facingIndicatorImage === undefined
  )
    return;
  doIndicator(tokenDocument);
}
