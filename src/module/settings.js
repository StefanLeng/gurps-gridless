import { drawEachReachIndicator } from './rangeindicator.js';

export const MODULE_ID = 'gurps-gridless';

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
}
