import { MODULE_ID } from './constants.js';

export function fixTokenScale(token) {
  const mesh = token.mesh;

  if (mesh._destroyed || mesh.texture === PIXI.Texture.EMPTY) return; //eslint-disable-line no-undef

  //const display = mesh.getDisplayAttributes();

  // Size the texture
  const rect = canvas.grid.grid.getRect(mesh.width, mesh.height);

  var scale = 1;
  if (token.document.lockRotation || mesh.width === mesh.height) {
    scale = Math.min(rect.width, rect.height) / Math.max(mesh.texture.width, mesh.texture.height); //fit into bounding box
  } else {
    scale = mesh.width > mesh.height ? rect.width / mesh.texture.width : rect.height / mesh.texture.height; // fit into longest token dimension
  }

  const scaleX = mesh.scale.x * scale;
  const scaleY = mesh.scale.y * scale;

  // Assign scale and attributes
  mesh.scale.set(scaleX, scaleY);

  // Compute x/y by taking into account scale and mesh anchor
  const px = mesh.x + (rect.width - mesh.width) * mesh.anchor.x + mesh.anchor.x * mesh.width;
  const py = mesh.y + (rect.height - mesh.height) * mesh.anchor.y + mesh.anchor.y * mesh.height;
  mesh.position.set(px, py);

  // Update the texture data for occlusion
  //mesh.updateTextureData();

  const artRotation = token.document.flags[MODULE_ID]?.artRotation ?? 0;

  var pivot = new PIXI.Point( //eslint-disable-line no-undef
    (canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetX ?? 0)) / scale / token.document.texture.scaleX,
    (canvas.grid.size * (token.document.flags[MODULE_ID]?.centerOffsetY ?? 0)) / scale / token.document.texture.scaleY,
  );
  if (artRotation != 0) {
    var mat = new PIXI.Matrix(); //eslint-disable-line no-undef
    mat.rotate((-artRotation / 180) * Math.PI);
    pivot = mat.apply(pivot);
  }

  mesh.pivot.y = pivot.y;
  mesh.pivot.x = pivot.x;

  const angle = (token.document.lockRotation ? 0 : mesh.rotation) + artRotation;
  mesh.angle = angle;
}
