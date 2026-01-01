import { MODULE_ID } from './constants.js';
import { isHexColumnGrid } from './token.js';

const PIXI = window.PIXI;

export async function drawIndicator(token) {
  if (!(game.settings.get(MODULE_ID, 'showFacingIndicator') ?? true) || token.GURPSGridlessIndicator) return;
  const scaling =
    (game.settings.get(MODULE_ID, 'facingIndicatorScale') ?? 1) *
    (token.document.flags[MODULE_ID]?.facingIndicatorScale ?? 1);
  const indicatorOffset = game.settings.get(MODULE_ID, 'facingIndicatorGap') ?? 0.2;
  const indicatorImage = token.document.flags[MODULE_ID]?.facingIndicatorImage
    ? token.document.flags[MODULE_ID]?.facingIndicatorImage
    : game.settings.get(MODULE_ID, 'facingIndicatorImage')
    ? game.settings.get(MODULE_ID, 'facingIndicatorImage')
    : 'modules/gurps-gridless/assets/simple_arrow.png';
  const show = token.document.flags[MODULE_ID]?.facingIndicatorEnabled ?? true;
  const { w: width, h: height } = token;
  const tokenOffset = token.document.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const container = new PIXI.Container({ width: width, height: height });
  container.width = width;
  container.height = height;
  container.x = width / 2;
  container.y = height / 2;
  container.pivot.set(0.5);
  const texture = await PIXI.Assets.load(indicatorImage);
  const indicator = new PIXI.Sprite(texture);
  container.addChild(indicator);
  indicator.anchor.set(0.5);
  indicator.scale.set(scaling);
  const gridSize = isHexColumnGrid() ? canvas.grid.sizeY : canvas.grid.sizeX;
  const offset = gridSize * (0.5 - tokenOffset + indicatorOffset);
  indicator.y = offset;
  container.angle = token.document.rotation;
  container.indicator = indicator;
  container.imagePaht = indicatorImage;
  container.visible = show;
  token.GURPSGridlessIndicator = container;
  token.addChild(container);
}

export function updateIndicatorDirection(token) {
  if (!token?.GURPSGridlessIndicator) return;
  token.GURPSGridlessIndicator.angle = token.document.rotation;
}

export async function updateIndicator(tokenDocument, changes) {
  if (!tokenDocument.object?.GURPSGridlessIndicator) return;
  if (
    changes.rotation === undefined &&
    changes.flags?.[MODULE_ID]?.tokenOffsetY === undefined &&
    changes.flags?.[MODULE_ID]?.facingIndicatorScale === undefined &&
    changes.flags?.[MODULE_ID]?.facingIndicatorEnabled === undefined &&
    changes.flags?.[MODULE_ID]?.facingIndicatorImage === undefined
  )
    return;
  const { w: width, h: height } = tokenDocument.object;
  const indicatorOffset = game.settings.get(MODULE_ID, 'facingIndicatorGap') ?? 0.2;
  const tokenOffset = tokenDocument.flags[MODULE_ID]?.tokenOffsetY ?? 0;
  const container = tokenDocument.object.GURPSGridlessIndicator;
  const scaling =
    (game.settings.get(MODULE_ID, 'facingIndicatorScale') ?? 1) *
    (tokenDocument.flags[MODULE_ID]?.facingIndicatorScale ?? 1);
  const show = tokenDocument.flags[MODULE_ID]?.facingIndicatorEnabled ?? true;
  const indicatorImage = tokenDocument.flags[MODULE_ID]?.facingIndicatorImage
    ? tokenDocument.flags[MODULE_ID]?.facingIndicatorImage
    : game.settings.get(MODULE_ID, 'facingIndicatorImage')
    ? game.settings.get(MODULE_ID, 'facingIndicatorImage')
    : 'modules/gurps-gridless/assets/simple_arrow.png';
  container.width = width;
  container.height = height;
  container.x = width / 2;
  container.y = height / 2;
  container.pivot.set(0.5);
  container.scale.set(1);
  if (container.imagePaht !== indicatorImage) {
    container.removeChild(container.indicator);
    const texture = await PIXI.Assets.load(indicatorImage);
    container.indicator = new PIXI.Sprite(texture);
    container.addChild(container.indicator);
  }
  const indicator = container.indicator;
  indicator.scale.set(scaling);
  const gridSize = isHexColumnGrid() ? canvas.grid.sizeY : canvas.grid.sizeX;
  const offset = gridSize * (0.5 - tokenOffset + indicatorOffset);
  indicator.y = offset;
  container.angle = tokenDocument.rotation;
  container.visible = show;
}
