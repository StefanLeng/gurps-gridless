# GURPS Token Shape and Movement (with Tools for Gridless GURPS)

This module enable GURPS compatible shapes and movment for larger (multi hex) tokens and adds some Tools for gridless play to the GURPS Game Aid System. It was formerly named "Tools for Gridless GURPS" but the functionalty expanded to hex shapes an movemnt on hex grid maps:

1. Replaces the border shown on the selected token and on mouse hover on a token with a border indicating facing.

![border example](border.png "Border example")

2. Displays an indicator for reach and front, side, back angles on a key press (Default: R for the current token, shift + R for all tokens). 
You can change the key binds under "configure Controls" in Foundry.

![range indicator example](rangeIndicator.png "Range Indicator example")

3. Support for non square tokens and all token sizes with proper Gurps movement (centered on the head of the creature with the body following). See below how to set up the token. 

4. Draw hex borders on Hex-Grids and enable proper GURPS movement on Hex-Grids (Version 0.7.0). To do that, I had to introduce my own token settings instead of some standard foundry settings. This will change the setup for all tokens in all scenes in the world. Therefore this has to be explizitly enabled in the module settings. Disabeling will restore the originl state. **It is important to disable the setting bevor disabeling or deinstalling the module**, otherwise the token settings will be messed up. If that happens, reinstall the module and disable the setting before deinstalling. **Version 3.26.5 or higher of the About Face module is nessesary for correct movements on hex maps.**  

![hex border example](hexborder.png "Hex Border example")

For background information how all this works, see *[here](background.md)*.

#### Limitations

1. At the moment, the reach indicator shown on hex maps is the same than on gridless maps. The facing colors will not in all cases match up to the hex grid facings and the reach shown will not be a hex shape. I will try to do a proper hex reach indicator in a future version, but it is quite complicated. As the reach indicator is not as important on a hex grid than on gridless, I don't consider it a big limitation.
  
2. There are some limitiations for tokens with locked rotation. See the token setup section for details.

Configuration:

![Configuration](configuration.png "Configuration")

Token configuration:

![token configuration](tokenConfiguration.png "Token Configuration")

The Module requires the GURPS Game Aid System and the About Face Module (at least version 3.26.5).

### Tips for gridless play
In the Foundry scene set the Grid Type to gridless, the Grid Scale to 1, the Grid Unit to Yd and the Grid Size to the number of pixel for 1 yard.
Note that most maps for foundry are made with an unrealistic large scale to allow play with the 5 feet grid of DnD. That is in most cases unnecessary for GURPS gridless play. 
I usually set the number of pixels given for one DnD 5 feet square for 1 yard and get a realistic scale. Individual maps may require adjustments.

### Configuration of tokens

#### With the _Enable GURPS tokens shapes and movement on Hex-Grids_ enabled (recommended)

With this option, setting the token shape and scaling is moved the the _GURPS Token Shape_ tab.

Set the desiered token _width_, _length_ and _scaling_. On hex maps, the width and length will be rounded to full hexes. Note that for the width, an even number of hexes will give an wired shape. Use an odd number for symetrical tokens. Onn gridless maps, all values work and are used as is. 

The center of rotation/movement will be automaticaly set at the center front hex for multi hex creatures (0.5 yards from the front on gridless maps). To modify that, use the _Lengthwise Offset_ and _Sideward Offset_ settings. For _Lengthwise Offset_, negative values will shift the center of rotation backwards and positive values forward. _Sideward Offset_ will shift the center left/right, but usually should be left on 0. 

On the apperance tab, you should set the _Image Fit Mode_: 
If the token image has the same aspect ratio as the token, use the Image Fit Mode "Contain".
If the token image is square, use the image fit mode "Full Height" for long tokens and "Full Width" for wide tokens.
I don't think any different aspect ratio will work. 

##### Notes on portrait style tokens

With portrait style tokens, it is usually not desirable to let the token image rotate. To archive that, you can set _Lock Rotation_ on the _Identity: tab. 

That works without problems for 1 hex creatures.

For bigger creatures there are some limitations: The center of the image will be on the center of rotation. By default, this is in the front of the crature with this module. That will look odd in some situations. 
You can move the center of rotation back to the center of rotation unsing the _Lengthwise Offset_, but in many cases that would be against the GURPS movement rules.
(For a future version, I am thinking about an option to fix the image position center of the token independend of the center of rotation, but I am not yet sure it can be done.)

With elongated token sizes, it will be even more problematic, because the border will rotate out of allingment with the image.
For elogated tokens, I recommend not locking rotation, even for portrait style tokens.

#### With the _Enable GURPS tokens shapes and movement on Hex-Grids_ disabled

If you use portrait style tokens just set the dimension of the Token on the Appearance tab and "Look rotation" on the Identity tab. Note that this will give somtimes odd results for elongated tokens.

For rotating top down style tokens set the dimension of the Token on the Appearance tab. 
If the token image has the same aspect ratio as the token, use the Image Fit Mode "Contain".
If the token image is square, use the image fit mode "Full Height" for long tokens and "Full Width" for wide tokens.
I don't think any different aspect ratio will work.

For multi hex tokens adjust the Anchor settings to move center of rotation to the head of the creature, if nessesary.
To move the the center of rotation to center of the first hex of a token of lenght X (in hexes), set the Anchor Y to <br/>1 - 0.5 / x

If you have to scale your token image, this will be interfer with the translation, because the anchor is used as the center of scaling. In this case, the formular will become <br/>(0.5 - 0.5 / x) / scale + 0.5

Examples:

One hex creatures like humans: Width: 1, Height: 1, Anchor X: 0.5, Anchor Y: 0.5, Image Fit Mode: Contain.

Long two hex creature like a lion: Width: 1, Height: 2, Anchor X: 0.5, Anchor Y: 0.75, If using a square image, Image Fit Mode: Full Height. 

Broad two hex creature like an large humanoid: Width: 2,  Height: 1, Anchor X: 0.5, Anchor Y: 0.5, If using a square image, Image Fit Mode: Full Width. 

Long tree hex creatures like an horse: Width: 1, Height: 3, Anchor X: 0.5, Anchor Y: 0.83, If using a square image, Image Fit Mode: Full Height.

Long 2 x 3 hex creature: Width: 2, Height: 3, Anchor X: 0.5, Anchor Y: 0.83, If using a square image, Image Fit Mode: Full Height.

Long three hex creatures with an image scaling of 1.5: Width: 1, Height: 3, Anchor X: 0.5, Anchor Y: 0.72, If using a square image, Image Fit Mode: Full Height.

### Legal

The material presented here is my original creation, intended for use with the [GURPS](http://www.sjgames.com/gurps) system from [Steve Jackson Games](ttp://www.sjgames.com). This material is not official and is not endorsed by Steve Jackson Games.

[GURPS](http://www.sjgames.com/gurps) is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games. All rights are reserved by Steve Jackson Games. This tool is the original creation of Stefan Leng and is released for free distributionunder the permissions granted in the [Steve Jackson Games Online Policy](http://www.sjgames.com/general/online_policy.html)


## Installation

This moduel can be installed via the Foundry Package Manager.
To install it manually, user thhis Manifest URL.
https://github.com/StefanLeng/gurps-gridless/releases/latest/download/module.json

## Development

### Prerequisites

In order to build this module, recent versions of `node` and `npm` are
required. Most likely, using `yarn` also works, but only `npm` is officially
supported. We recommend using the latest lts version of `node`. If you use `nvm`
to manage your `node` versions, you can simply run

```
nvm install
```

in the project's root directory.

You also need to install the project's dependencies. To do so, run

```
npm install
```

### Building

You can build the project by running

```
npm run build
```

Alternatively, you can run

```
npm run build:watch
```

to watch for changes and automatically build as necessary.

### Linking the built project to Foundry VTT

In order to provide a fluent development experience, it is recommended to link
the built module to your local Foundry VTT installation's data folder. In
order to do so, first add a file called `foundryconfig.json` to the project root
with the following content:

```
{
  "dataPath": ["/absolute/path/to/your/FoundryVTT"]
}
```

(if you are using Windows, make sure to use `\` as a path separator instead of
`/`)

Then run

```
npm run link-project
```

On Windows, creating symlinks requires administrator privileges, so
unfortunately you need to run the above command in an administrator terminal for
it to work.

You can also link to multiple data folders by specifying multiple paths in the
`dataPath` array.

### Creating a release

The workflow works basically the same as the workflow of the [League Basic JS Module Template], please follow the
instructions given there.

## Licensing

This project is being developed under the terms of the
[LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT] for Foundry Virtual Tabletop.

Please add your licensing information here. Add your chosen license as
`LICENSE` file to the project root and mention it here.  If you don't know which
license to choose, take a look at [Choose an open source license].

[League Basic JS Module Template]: https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template
[LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT]: https://foundryvtt.com/article/license/
[Choose an open source license]: https://choosealicense.com/
