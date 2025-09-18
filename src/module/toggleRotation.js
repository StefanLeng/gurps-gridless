import { MODULE_ID } from './constants.js';

function isToolbarButtonEnabled() {
  return game.settings.get(MODULE_ID, 'showToggleRotaionButton');
}

export function createToggleRotationButton(controls) {
  if (isToolbarButtonEnabled()) {
    const tokenButton = controls.tokens;
    if (tokenButton) {
      const newButton = {
        name: 'toggleRotationOnMovemnt',
        title: game.i18n.localize('gurps-gridless.button.toggleRotationOnMove.name'),
        icon: 'fas fa-rotate',
        toggle: true,
        active: !game.gurpsGridLess.supressRotationOnMove,
        visible: true,
        onChange: () => {
          game.gurpsGridLess.supressRotationOnMove = !game.gurpsGridLess.supressRotationOnMove;
        },
      };
      tokenButton.tools['toggleRotationOnMovemnt'] = newButton;
    }
  }
}

export function toggleRotationOnMovement() {
  game.gurpsGridLess.supressRotationOnMove = !game.gurpsGridLess.supressRotationOnMove;
  if (isToolbarButtonEnabled() && !!ui.controls?.controls?.tokens) {
    ui.controls.controls.tokens.tools['toggleRotationOnMovemnt'].active = !game.gurpsGridLess.supressRotationOnMove;
    ui.controls.render();
  }
}
