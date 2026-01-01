/* eslint-disable prettier/prettier */
import { drawEachReachIndicator } from './rangeindicator.js';
import { MODULE_ID } from './constants.js';
import { defaultColors } from './constants.js';
import { enableGURPSMovmentforAllScenes, disableGURPSMovmentforAllScenes } from './scene.js';
import { setVisionAdjustment } from './vision.js';
import { doEachBorder } from './borders.js';
import { toggleRotationOnMovement, retreatControledTokens } from './toggleRotation.js';

export class GURPSGridLess {
  constructor() {
    this.showRangeIndicator = false;
    this.showRangeIndicatorAll = false;
    this.supressRotationOnMove = false;
  }
  showRangeIndicator;
  showRangeIndicatorALL;
  supressRotationOnMove;
}

export function onGURPSMovementEnabledChanged(enabled) {
  if (enabled) {
    enableGURPSMovmentforAllScenes();
  } else {
    disableGURPSMovmentforAllScenes();
  }
}

export function registerSettings() {
  game.keybindings.register(MODULE_ID, 'showRangeIndicator', {
    name: 'gurps-gridless.keybindings.showRangeIndicator.name',
    hint: 'gurps-gridless.keybindings.showRangeIndicator.hint',
    editable: [
      {
        key: 'KeyI',
      },
    ],
    onDown: () => {
      game.gurpsGridLess.showRangeIndicator = true;
      drawEachReachIndicator();
    },
    onUp: () => {
      game.gurpsGridLess.showRangeIndicator = false;
      drawEachReachIndicator();
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  game.keybindings.register(MODULE_ID, 'showRangeIndicatorAll', {
    name: 'gurps-gridless.keybindings.showRangeIndicatorAll.name',
    hint: 'gurps-gridless.keybindings.showRangeIndicatorAll.hint',
    editable: [
      {
        key: 'KeyI',
        modifiers: ['SHIFT'],
      },
    ],
    onDown: () => {
      game.gurpsGridLess.showRangeIndicatorAll = true;
      drawEachReachIndicator();
    },
    onUp: () => {
      game.gurpsGridLess.showRangeIndicatorAll = false;
      drawEachReachIndicator();
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  game.keybindings.register(MODULE_ID, 'toggleRotationOnMove', {
    name: 'gurps-gridless.keybindings.toggleRotationOnMove.name',
    hint: 'gurps-gridless.keybindings.toggleRotationOnMove.hint',
    editable: [
      {
        key: 'KeyV',
      },
    ],
    onUp: toggleRotationOnMovement,
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  game.keybindings.register(MODULE_ID, 'retreat', {
    name: 'gurps-gridless.keybindings.retreat.name',
    hint: 'gurps-gridless.keybindings.retreat.hint',
    editable: [
      {
        key: 'KeyB',
      },
    ],
    onUp: retreatControledTokens,
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  game.settings.register(MODULE_ID, 'version', {
    scope: 'world',
    config: true,
    default: '0.0.0',
    type: String,
  });

  game.settings.register(MODULE_ID, 'maxReachShown', {
    name: 'gurps-gridless.settings.maxReachShown.name',
    hint: 'gurps-gridless.settings.maxReachShown.description',
    scope: 'world',
    config: true,
    default: 2.0,
    type: Number,
    range: {
      min: 0.0,
      max: 15.0,
      step: 1.0,
    },
  });

  game.settings.register(MODULE_ID, 'reachIndicatorOverdraw', {
    name: 'gurps-gridless.settings.reachIndicatorOverdraw.name',
    hint: 'gurps-gridless.settings.reachIndicatorOverdraw.description',
    scope: 'world',
    config: true,
    default: 0.5,
    type: Number,
    range: {
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
  });

  game.settings.register(MODULE_ID, 'reachLineAlpha', {
    name: 'gurps-gridless.settings.reachLineAlpha.name',
    hint: 'gurps-gridless.settings.reachLineAlpha.description',
    scope: 'world',
    config: true,
    default: defaultColors.lineAlpha,
    type: Number,
    range: {
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
  });

  game.settings.register(MODULE_ID, 'facingAlpha', {
    name: 'gurps-gridless.settings.facingAlpha.name',
    hint: 'gurps-gridless.settings.facingAlpha.description',
    scope: 'world',
    config: true,
    default: defaultColors.fillAlpha,
    type: Number,
    range: {
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
  });

  game.settings.register(MODULE_ID, 'innerBorderWidth', {
    name: 'gurps-gridless.settings.innerBorderWidth.name',
    hint: 'gurps-gridless.settings.innerBorderWidth.description',
    scope: 'world',
    config: true,
    default: 6.0,
    type: Number,
    range: {
      min: 0.0,
      max: 20.0,
      step: 1.0,
    },
  });

  game.settings.register(MODULE_ID, 'outerBorderWidth', {
    name: 'gurps-gridless.settings.outerBorderWidth.name',
    hint: 'gurps-gridless.settings.outerBorderWidth.description',
    scope: 'world',
    config: true,
    default: 6.0,
    type: Number,
    range: {
      min: 0.0,
      max: 20.0,
      step: 1.0,
    },
  });

  game.settings.register(MODULE_ID, 'alwaysShowOuterBorder', {
    name: 'gurps-gridless.settings.alwaysShowOuterBorder.name',
    hint: 'gurps-gridless.settings.alwaysShowOuterBorder.description',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: doEachBorder,
  });

  game.settings.register(MODULE_ID, 'GURPSMovementEnabled', {
    name: 'gurps-gridless.settings.GURPSMovmentEnabled.name',
    hint: 'gurps-gridless.settings.GURPSMovmentEnabled.description',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: onGURPSMovementEnabledChanged,
  });

  game.settings.register(MODULE_ID, 'VisionAdjustmetEnabled', {
    name: 'gurps-gridless.settings.VisionAdjustmetEnabled.name',
    hint: 'gurps-gridless.settings.VisionAdjustmetEnabled.description',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    onChange: setVisionAdjustment,
  });

  game.settings.register(MODULE_ID, 'showToggleRotaionButton', {
    name: 'gurps-gridless.settings.showToggleRotaionButton.name',
    hint: 'gurps-gridless.settings.showToggleRotaionButton.description',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
  });

  
  game.settings.register(MODULE_ID, 'showFacingIndicator', {
    name: 'gurps-gridless.settings.showFacingIndicator.name',
    hint: 'gurps-gridless.settings.showFacingIndicator.description',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
  });

  game.settings.register(MODULE_ID, 'facingIndicatorGap', {
    name: 'gurps-gridless.settings.facingIndicatorGap.name',
    hint: 'gurps-gridless.settings.facingIndicatorGap.description',
    scope: 'world',
    config: true,
    default: 0.2,
    type: Number,
    range: {
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
    requiresReload: true,
  });

game.settings.register(MODULE_ID, 'facingIndicatorScale', {
    name: 'gurps-gridless.settings.facingIndicatorScale.name',
    hint: 'gurps-gridless.settings.facingIndicatorScale.description',
    scope: 'world',
    config: true,
    default: 1,
    type: Number,
    range: {
      min: 0.1,
      max: 5.0,
      step: 0.05,
    },
    requiresReload: true,
  });

game.settings.register(MODULE_ID, 'facingIndicatorImage', {
    name: 'gurps-gridless.settings.facingIndicatorImage.name',
    hint: 'gurps-gridless.settings.facingIndicatorImage.description',
    scope: 'world',
    config: true,
    default: "",
    filePicker: true,
    requiresReload: true,
  });

  setVisionAdjustment(game.settings.get(MODULE_ID, 'VisionAdjustmetEnabled'));
}

function generateElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export function modifyTokenConfig(app, html, data) {
  if (game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) {
    html.classList.add('gurp-gridless-active');

    const injectionPoint = html.querySelector('.tab[data-tab="appearance"] file-picker[name="texture.src"]').parentNode.parentNode;
    const injectHtml = generateElement(`<div class="form-group slim"><label>${game.i18n.localize(
          'gurps-gridless.tokenSettings.explanation',
        )}</label></div>`,)
    injectionPoint.after(injectHtml);

     const indicatorEnabled = data.source.flags?.[MODULE_ID]?.facingIndicatorEnabled;
    if (indicatorEnabled === undefined){
       const indicatorEnabledCheckbox = html.querySelector('input[name="flags.gurps-gridless.facingIndicatorEnabled"]');
       indicatorEnabledCheckbox.checked = true;
    }
  }

}

export function addTokenConfigTab(app) {
	app.TABS.sheet.tabs.push({ id: MODULE_ID, label: game.i18n.localize('gurps-gridless.tokenSettings.tab.name'), icon: "far fa-circle" });
    const footer = app.PARTS.footer;
    delete app.PARTS.footer;
    app.PARTS[MODULE_ID] = {template: "modules/gurps-gridless/templates/gurpsgridlessTokenConfig.hbs", scrollable: [""]};
    app.PARTS.footer = footer;
}
