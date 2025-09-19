import { MODULE_ID } from './constants.js';

const toolButtonName = 'gurps-gridless-toggleRotationOnMovemnt';

function isToolbarButtonEnabled() {
  return game.settings.get(MODULE_ID, 'showToggleRotaionButton');
}

export function createToggleRotationButton(controls) {
  if (isToolbarButtonEnabled()) {
    const tokenButton = controls.tokens;
    if (tokenButton) {
      const newButton = {
        name: toolButtonName,
        title: game.i18n.localize('gurps-gridless.button.toggleRotationOnMove.name'),
        icon: 'fas fa-rotate',
        toggle: true,
        active: !game.gurpsGridLess.supressRotationOnMove,
        visible: true,
        onChange: () => {
          game.gurpsGridLess.supressRotationOnMove = !game.gurpsGridLess.supressRotationOnMove;
        },
      };
      tokenButton.tools[toolButtonName] = newButton;
    }
  }
}

export function toggleRotationOnMovement() {
  game.gurpsGridLess.supressRotationOnMove = !game.gurpsGridLess.supressRotationOnMove;
  if (isToolbarButtonEnabled() && !!ui.controls?.controls?.tokens) {
    ui.controls.controls.tokens.tools[toolButtonName].active = !game.gurpsGridLess.supressRotationOnMove;
    ui.controls.render();
  }
}

export async function retreat(token) {
  const point = { x: token.document.x, y: token.document.y, elevation: token.document.elevation };
  const direction = token.document.rotation - 90;
  const newPoint = canvas.grid.getTranslatedPoint(point, direction, 1);
  const [, constraint] = token.constrainMovementPath([point, newPoint]);
  if (!constraint) {
    token.document.move(newPoint, { autoRotate: false, constrainOptions: { ignoreWalls: false } });
  }
}

export function retreatControledTokens() {
  for (let token of canvas.tokens.controlled) {
    retreat(token);
  }
}
