import {defaultColors, faceAngels }  from "./constants.js";

export function doborder (token) 
{ 
	const tokenDirection = token.document.flags["about-face"]?.direction ?? 90;

	const {
		_,
		__,
		___,
		frontColor,
		sideColor,
		backColor
	} = defaultColors;
	
	const { w: width, h: height } = token;
	token.border.x = token.document.x + width / 2;
	token.border.y = token.document.y + height / 2;
    token.border.clear();
	
	const borderColor = token._getBorderColor();//null if there should be no border
    
	const innerWidth = 3;
    const outerWidth = 2
	const gridSize = canvas.grid.size;
    const innerBorder = gridSize / 2;
    const outerBorder = innerBorder + innerWidth;

	if ( borderColor)
	{
		token.border
        .lineStyle(innerWidth, borderColor, 1)
        .drawCircle(0, 0, innerBorder)
		.lineStyle(outerWidth, frontColor, 1)
		.arc(0, 0, outerBorder,faceAngels.start, faceAngels.front)
		.lineStyle(outerWidth, sideColor, 1)
		.arc(0, 0, outerBorder, faceAngels.front, faceAngels.right)
		.lineStyle(outerWidth, backColor, 1)
		.arc(0, 0, outerBorder, faceAngels.right, faceAngels.back)
		.lineStyle(outerWidth, sideColor, 1)
		.arc(0, 0, outerBorder, faceAngels.back, faceAngels.left);
	}

	token.border.angle = tokenDirection - 90;
}