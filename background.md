# Background: GURPS Multihex Creatures, Movement and Foundry VTT

This document discribes my approch to GURPS multi-hex creatures in foundry. It is as much for my own documentation as for anything else.

### GURPS movement for multi hex creatures

The rules for multi-hex creatures and there movement in tactical combat are very brief, just halv a page in the Basic Set. They are very general and don't cover the specifics for many token shapes. Most important, there are no examples or explanations for creatures that are wider than long. I did my best to extrapolate from the rules for situations not coverd.

What the rules do state, is that the creatures should not move and rotate around its corner, but around center of the hex at the head of the creature, usually the center front hex. This hex moves as normal and the rest of the body follows. 

The front of the token allways shoud face a hex eedge.

### What foundry does nativly

On hex maps, foundry ( as of V12) bases the movement on the center of the token shape. On hex columns, if the heigth of the token is an odd number of hexes, it snaps to an hex center, if it is an even number it snaps to an hex edge. On hex rows, the same is true for the width of the token. 

Furthermore, in foundry the initial orientation (with rotation 0) of a toke is always facing down. In this orientation, there is no hex shape fitting to the grid for long tokens on hex rows and for wide tokens on hex rows. In this cases, foundry falls back to a rectagle shape, totally taking the center and the scaling of the token of the grid.

As for rotation, foundry only rotates the token image. The border based on the shape of the token and the hit box allways remain in the initial orientation. This only works ok for tokens with the same height and width that rotate around thier center. In all other cases, ther is misalingment betwen the border / hit box and the token immage.

The About Face module in the current version will make sure the token orientation snaps to face a hex edge, so we are coverd on that front.

### What we need 

For correct GURPS movement we need tokens that rotate around the center of their front hex and always snap the center of this hex to an grid hex center. And it should do this both on hex columns an on hex grids.

### What can we do and what not

As far as I can tell, we can not change the grid snapping mechanisem without overwriting core foundry code, I like to avoid that.

We can set the dimensions of the token. We also can set the center of rotation.

It is also possible to draw the token border and overwite the hit box in any shape we want. The hit box dosn't have to be a box, any polygon is possible. Or maybe only every convex polygon, but that is all we need to shape it to the hex shape.

### My solution

The basic idea is to set the dimension, offset and scaling of the token so that foundry does the correct movement and then draw the border and the hit area to the "real" dimensions and orientation.

So I created my own controls for the dimensions, scale and center offset and hid the foundry controls. The user set dimensions will be saved in new properties ("flags") and the foundry values will be calculated from them.

To get the desiered movement on both hex columns and rows, we need the foundry height and length to be the same and an odd number of hexes. So I set them to the higher of the user provided heigth and length, +1 if even. 
I then set the anchorY half a hex from the front (modified by the user provided offset). For tokens with an even number of hexes as width (these are wired, because they need to be non symetrical by the GURPS rules), I set the anchorY half a hex to the left. That makes sure that the center of rotation always falls on a hex center in the token shape. Because the center of rotation will always snap the a hex center on the grid in this configuration, the hexes of the token shape and the grid will always match up.

Because foundry bases the scaling of the token image on the dimensions of the token and a scaling factor, I also need the adjust the scaling factor for the changed token dimensions. For these cases when foundry falls back to a box shape, an extra scaling corretion is needed.

Then I draw the token border and the token hit box according to the user provided dimensions scaling and offset and rotate them in the direction provided by About Face.