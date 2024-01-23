export function fixTokenScale(token) {
    const mesh = token.mesh;
  
    if ( mesh._destroyed || (mesh.texture === PIXI.Texture.EMPTY) ) return;
    const display = mesh.getDisplayAttributes();
  
    // Size the texture
    const rect = canvas.grid.grid.getRect(display.width, display.height);
  
    var scale = 1;
    if (token.document.lockRotation || display.width === display.height) {
      scale = Math.min(rect.width, rect.height) / Math.max(mesh.texture.width, mesh.texture.height); //fit into bounding box
    } else {
      scale = (display.width > display.height) ? rect.width / mesh.texture.width :  rect.height / mesh.texture.height; // fit into longest token dimencion
    }
   
    display.scaleX *= scale;
    display.scaleY *= scale;
  
    // Assign scale and attributes
    mesh.scale.set(display.scaleX, display.scaleY);
  
    // Compute x/y by taking into account scale and mesh anchor
    const px = display.x + ((rect.width - mesh.width) * mesh.anchor.x) + (mesh.anchor.x * mesh.width);
    const py = display.y + ((rect.height - mesh.height) * mesh.anchor.y) + (mesh.anchor.y * mesh.height);
    mesh.setPosition(px, py);
  
    // Update the texture data for occlusion
    mesh.updateTextureData();
  }