# Background: GURPS Multi-Hex Creatures, Movement, and Foundry VTT

This document describes my approach to handling GURPS multi-hex creatures in Foundry VTT. It serves both as a reference for users and as personal documentation. Therfore some of it is very technical. 

## GURPS Movement for Multi-Hex Creatures

The GURPS Basic Set covers movement for multi-hex creatures in tactical combat in **just half a page**, providing only **general** rules. There are no examples or specific guidance for creatures **wider than they are long**. To address these gaps, I extrapolated reasonable solutions based on existing rules.

### **Core GURPS Rules for Multi-Hex Movement:**
- A multi-hex creature **moves and rotates around the center of the hex at its head** (typically, the center front hex).
- This front hex moves **normally**, and the rest of the body follows.
- The **front of the token must always face a hex edge**.

## Foundry’s Default Behavior (As of Version 12)

Foundry’s native handling of hex maps does not fully align with GURPS rules:

### **Grid Snapping Issues**
- Foundry **bases movement on the token’s center** rather than the designated front hex.
- On **hex-column grids**, if a token’s **height** is an odd number of hexes, it snaps to a hex center; if even, it snaps to a hex edge.
- On **hex-row grids**, the same behavior applies to the **token’s width**.
- The initial orientationis always facing down. In this orientation, there is no hex shape fitting to the grid for long tokens on hex rows and for wide tokens on hex rows. In this cases, foundry falls back to a rectagle shape, totally taking the center and the scaling off the grid.

### **Rotation**
- Fondry only rotates the token image, not the border and the hit area. This will result in misalingment, excpecialy for elongated tokens and tokens rotation around a point not at there center.

The About Face module in the current version will make sure the token orientation snaps to face a hex edge, so we are covered on that front.

## My Solution

The approach I implemented involves:

1. **Custom Controls for Token Dimensions and Scaling**
   - Foundry’s default token settings are **hidden**.
   - Users input token **width, length, and scale** into custom properties.
   - These values are stored as module-specific **flags**, and the Foundry settings are calculated from them.

2. **Adjusting Foundry’s Snapping Behavior**
   - To ensure proper snapping across **hex-column and hex-row grids**, the **height and length** must be **equal** and **an odd number of hexes**.
   - The module **sets token dimensions** to the larger of the user-provided height/length (rounding up to the nearest odd number if necessary).

3. Adjust the **scaling of the token image**  for the changed token dimensions.  

4. **Move the anchor of the token image** so that the point half a hex from the front of the image falls on the center of the modified token. 
   - For tokens with a **even width** I move the anchor half a hex to the left, so that it falls on a hex center.

5. Draw the **border and the hit area** at the position whre the token should be based on the center of rotation and the scaling and **rotate** them to the direction provided by About Face.

So the Foundry token dimesions are set so that there **center of the Token always falls on a hex center**. This is used as the center of movement and rotation by Foundry. Then the **token image, border and hit area** are drawn so that the desierd **center of rotation (usually the head) is movend to the token center**. Note that in some cases that leads to part of the token hit area being outside of the token bounding box. But all targeting functionalities use only the hit area, so this is no problem.  
