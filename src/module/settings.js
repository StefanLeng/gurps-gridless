import { drawEachReachIndicator } from './rangeindicator.js';
import { MODULE_ID } from './constants.js';
import { injectConfig } from './lib/injectConfig.js';
import { defaultColors } from './constants.js';

export class GURPSGridLess {
  constructor() {
    this.showRangeIndicator = false;
    this.showRangeIndicatorAll = false;
  }
  showRangeIndicator;
  showRangeIndicatorALL;
}

export function registerSettings() {
  game.keybindings.register(MODULE_ID, 'showRangeIndicator', {
    name: 'gurps-gridless.keybindings.showRangeIndicator.name',
    hint: 'gurps-gridless.keybindings.showRangeIndicator.hint',
    editable: [
      {
        key: "KeyR"
      }
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
        key: "KeyR",
        modifiers: [ "SHIFT" ]
      }
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
}

export function injectTokenConfig(app, html, data) {
  const injHtml = injectConfig.inject(app, html, {
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
    centerOffsetY: {
      type: 'number',
      label: game.i18n.localize('gurps-gridless.tokenSettings.centerOffsetY.name'),
      default: '0',
      min: '-10.0',
      max: '10.0',
      step: '0.1',
  },
  centerOffsetX: {
    type: 'number',
    label: game.i18n.localize('gurps-gridless.tokenSettings.centerOffsetX.name'),
    notes: game.i18n.localize('gurps-gridless.tokenSettings.centerOffset.notes'),
    default: '0',
    min: '-10.0',
    max: '10.0',
    step: '0.1',
  },
  artRotation: {
    type: 'number',
    label: game.i18n.localize('gurps-gridless.tokenSettings.artRotation.name'),
    notes: game.i18n.localize('gurps-gridless.tokenSettings.artRotation.notes'),
    default: '0',
    min: '-90.0',
    max: '+90.0',
    step: '1',
},
});

}

