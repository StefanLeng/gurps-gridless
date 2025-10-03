/* eslint-disable prettier/prettier */
import { drawEachReachIndicator } from './rangeindicator.js';
import { MODULE_ID } from './constants.js';
import { injectConfig } from './lib/injectConfig.js';
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
  });

  setVisionAdjustment(game.settings.get(MODULE_ID, 'VisionAdjustmetEnabled'));
}

export function injectTokenConfig(app, html, object) {
  let jhtml = $(html); //eslint-disable-line no-undef
  if (game.settings.get(MODULE_ID, 'GURPSMovementEnabled')) {
    jhtml.addClass('gurp-gridless-active');

    injectConfig.inject(app, jhtml, {
      inject: '.tab[data-tab="appearance"] file-picker[name="texture.src"]',
      moduleId: MODULE_ID,
      explaination: {
        type: 'custom',
        html: `<div class="form-group slim"><label>${game.i18n.localize(
          'gurps-gridless.tokenSettings.explanation',
        )}</label></div>`,
      },
    });
  }

  const configItems = game.settings.get(MODULE_ID, 'GURPSMovementEnabled')
    ? {
        moduleId: MODULE_ID,
        tab: {
          name: MODULE_ID,
          label: game.i18n.localize('gurps-gridless.tokenSettings.tab.name'),
          icon: 'far fa-circle',
        },
        maxReachShown: {
          type: 'number',
          label: game.i18n.localize('gurps-gridless.settings.maxReachShown.name'),
          default: '',
          placeholder: game.i18n.localize('gurps-gridless.tokenSettings.maxReachShown.placeholder'),
          min: '0.0',
          max: '15.0',
          step: '1.0',
        },
        tokenWidth: {
          type: 'number',
          label: game.i18n.localize('gurps-gridless.tokenSettings.tokenWidth.name'),
          default: '',
          max: '30.0',
          step: '1.0',
          notes: game.i18n.localize('gurps-gridless.tokenSettings.tokenWidth.note'),
        },
        tokenLength: {
          type: 'number',
          label: game.i18n.localize('gurps-gridless.tokenSettings.tokenLength.name'),
          default: '',
          min: '1.0',
          max: '30.0',
          step: '1.0',
          notes: game.i18n.localize('gurps-gridless.tokenSettings.tokenLength.note'),
        },
        tokenScaling: {
          type: 'range',
          label: game.i18n.localize('gurps-gridless.tokenSettings.tokenScaling.name'),
          default: '',
          min: '0.0',
          max: '3.0',
          step: '0.1',
        },
        tokenOffsetY: {
          type: 'number',
          label: game.i18n.localize('gurps-gridless.tokenSettings.rotationOffsetY.name'),
          default: 0,
          min: '-30.0',
          max: '30.0',
          step: '0.1',
          notes: game.i18n.localize('gurps-gridless.tokenSettings.rotationOffsetY.note'),
        },
        tokenOffsetX: {
          type: 'number',
          label: game.i18n.localize('gurps-gridless.tokenSettings.rotationOffsetX.name'),
          default: 0,
          min: '-30.0',
          max: '30.0',
          step: '0.1',
          notes: game.i18n.localize('gurps-gridless.tokenSettings.rotationOffsetX.note'),
        },
        tokenImageOffsetY: {
            type: 'number',
            label: game.i18n.localize('gurps-gridless.tokenSettings.imageOffsetY.name'),
            default: 0,
            min: '-30.0',
            max: '30.0',
            step: '0.1',
            notes: game.i18n.localize('gurps-gridless.tokenSettings.imageOffsetY.note'),
          },
          tokenImageOffsetX: {
            type: 'number',
            label: game.i18n.localize('gurps-gridless.tokenSettings.imageOffsetX.name'),
            default: 0,
            min: '-30.0',
            max: '30.0',
            step: '0.1',
            notes: game.i18n.localize('gurps-gridless.tokenSettings.imageOffsetX.note'),
          },
      }
    : {
        moduleId: MODULE_ID,
        tab: {
          name: MODULE_ID,
          label: game.i18n.localize('gurps-gridless.tokenSettings.tab.name'),
          icon: 'far fa-circle',
        },
        maxReachShown: {
          type: 'number',
          label: game.i18n.localize('gurps-gridless.settings.maxReachShown.name'),
          default: '',
          placeholder: game.i18n.localize('gurps-gridless.tokenSettings.maxReachShown.placeholder'),
          min: '0.0',
          max: '15.0',
          step: '1.0',
        },
      };
  injectConfig.inject(app, jhtml, configItems, object);
}
