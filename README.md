# gurps-gridless

This Module adds some Tools for gridless play to the GURPS Game Aid System. :

1. Replaces the border shown on the selected token and on mouse hover on a token with a border indicating facing.

![border example](border.png "Border example")

2. Displays an indicator for reach and front, side, back angles on a key press (Default: R for the current token, shift + R for all tokens). 
You can change the key binds under "configure Controls" in Foundry.

![range indicator example](rangeIndicator.png "Range Indicator example")

3. Support for non square tokens and all token sizes.

With version 0.6 for Foundry 12 I had to remove the following fetures 

1. _Shift the center of rotation_. With Foundry 12 the center of rotation can nativly shifted with the Anchor X and Y settings on the appearace tab. 

2. _fixing Foundry scaling for token images that the token image scales with tihe longest token dimension_. This is not longer possible and not desirable anyway. 
Foundry 12 will scale the image to fit into the token dimension. If your token immage has the same aspect ratio as the token, this will be OK. If your immage is square (common for token art meant for D&D) you have to adjust the scale of the immage by the aspect ratio. See below for examples.

3. _Rotate token art to face in the correct direction (downward) inside the token border_. This is not longer possible with Foundry 12 in some situations. It was quite hacky anyway. Use downward facing Token Images as recommendet by Foundry. if nessesary use an image editing programm to rotate the images beforhand.      

Configuration:

![Configuration](configuration.png "Configuration")

Token configuration:

![token configuration](tokenConfiguration.png "Token Configuration")

The Module requires the GURPS Game Aid System and the About Face Module.

### Tips for gridless play
In the Foundry scene set the Grid Type to gridless, the Grid Scale to 1, the Grid Unit to Yd and the Grid Size to the number of pixel for 1 yard.
Note that most maps for foundry are made with an unrealistic large scale to allow play with the 5 feet grid of DnD. That is in most cases unnecessary for GURPS gridless play. 
I usually set the number of pixels given for one DnD 5 feet square for 1 yard and get a realistic scale. Individual maps may require adjustments.

### Konfiguration of tokens
If you use portrait style tokens just set the dimension of the Token on the Appearance tab and look Rotation on the Identity tab.

For rotating top down style tokens set the dimension of the Token on the Appearance tab. 
If the aspect ratio of the immage differs from the aspect ratio of the token, you may have to adjust the scale to compensate for foundry scaling to fit the immage into the token dimensions.
For multi Hex tokens adjust the Anchor settings to move center of rotation to the head of the creature, if nessesary.

Examples:
One Hex creatures like humans: Width: 1, Height: 1, Anchor X: 0.5, Anchor Y: 0.5, no Scale Adjustment.
Long two Hex creature like a lion: Width: 1, Height: 2, Anchor X: 0.5, Anchor Y: 0.75, If using a square immage, adjust the scale by a factor of 2. 
Broad two Hex creature like an large humanoid: Width: 2,  Height: 1, Anchor X: 0.5, Anchor Y: 0.5, If using a square immage, adjust the scale by a factor of 2. 
Long tree Hex creatures like an horse: Width: 1, Height: 3, Anchor X: 0.5, Anchor Y: 0.83, If using a square immage, adjust the scale by a factor of 3.
Long 2 x 3 Hex crature: Width: 2, Height: 3, Anchor X: 0.5, Anchor Y: 0.83, If using a square immage, adjust the scale by a factor of 3/2.

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
